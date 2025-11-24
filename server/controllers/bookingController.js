// server/controllers/bookingController.js
import connectDB from "../configs/db.js";
import { sendReservationEmail } from "../utils/reservationEmail.js";
import { v2 as cloudinary } from "cloudinary";
import connectCloudinary from "../configs/cloudinary.js";

// Initialize Cloudinary
connectCloudinary();

// ✅ Function to check room availability
const checkAvailability = async ({ checkInDate, checkOutDate, roomId }) => {
  try {
    const pool = await connectDB();

    const [bookings] = await pool.query(
      `SELECT * 
       FROM bookings 
       WHERE room_type_id = ?
       AND (
         (check_in <= ? AND check_out >= ?)
       )`,
      [roomId, checkOutDate, checkInDate]
    );

    // If there are no overlapping bookings, room is available
    return bookings.length === 0;
  } catch (error) {
    console.error("Error checking availability:", error);
    throw error;
  }
};

// ✅ API: Check availability of a room
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      roomId,
    });
    res.json({ success: true, isAvailable });
  } catch (error) {
    console.error("Error in checkAvailabilityAPI:", error);
    res.status(500).json({
      success: false,
      message: "Error checking room availability",
    });
  }
};

// API: Create a new booking
// POST /api/bookings/book
export const createBooking = async (req, res) => {
  try {
    // Handle FormData (multipart/form-data)
    // Note: FormData fields come as strings, need to parse numbers
    const email = req.body.email;
    const roomId = req.body.roomId;
    const roomNumber = req.body.roomNumber || null; // legacy single room number
    const checkInDate = req.body.checkInDate;
    const checkOutDate = req.body.checkOutDate;
    const adults = parseInt(req.body.adults) || 1;
    const children = parseInt(req.body.children) || 0;
    const totalPrice = parseFloat(req.body.totalPrice) || 0; // price per room
    const basePrice = parseFloat(req.body.basePrice) || totalPrice;
    const bookingTotalPrice = parseFloat(req.body.bookingTotalPrice) || totalPrice;
    const roomCount = parseInt(req.body.roomCount) || 1;
    const roomQuantity = parseInt(req.body.roomQuantity) || roomCount; // New: quantity from frontend
    const discountAmount = parseFloat(req.body.discountAmount) || 0;
    const isPaid = req.body.isPaid === "true" || req.body.isPaid === true;
    const discountType = req.body.discountType || "None";
    
    // Additional guest information
    const guestName = req.body.guestName || "";
    const phoneNumber = req.body.phoneNumber || "";
    const address = req.body.address || "";
    const nationality = req.body.nationality || "";
    const deposit = parseFloat(req.body.deposit) || 0;
    const paymentMode = req.body.paymentMode || "Cash";
    const signature = req.body.signature || "";
    const remarks = req.body.remarks || "";

    console.log("📥 Received booking data:", req.body);

    const db = await connectDB();

    // Convert ISO date to MySQL DATE format (YYYY-MM-DD) - needed for room assignment
    const formatDate = (date) => new Date(date).toISOString().slice(0, 10);
    const formattedCheckIn = formatDate(checkInDate);
    const formattedCheckOut = formatDate(checkOutDate);

    // Get room_type_id - try to use roomId first, otherwise look up by roomName
    let roomTypeId = roomId;
    const roomName = req.body.roomName;
    
    if (!roomTypeId && roomName) {
      // Look up room_type_id by type_name
      const [roomTypeRows] = await db.query(
        "SELECT room_type_id FROM room_types WHERE type_name = ?",
        [roomName]
      );
      if (roomTypeRows.length > 0) {
        roomTypeId = roomTypeRows[0].room_type_id;
      }
    }
    
    if (!roomTypeId) {
      return res.status(400).json({
        success: false,
        message: "Room type not found. Please provide a valid room type.",
      });
    }

    // Room numbers will NOT be auto-assigned - admin will assign them later
    // Create bookings with room_number = NULL based on quantity
    const roomNumbers = [];
    for (let i = 0; i < roomQuantity; i++) {
      roomNumbers.push(null); // All bookings created without room numbers - admin assigns later
    }

    // Upload ID image to Cloudinary if provided
    let idImageUrl = null;
    if (req.file) {
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "booking_ids",
          resource_type: "image",
        });
        idImageUrl = uploadResult.secure_url;
        console.log("✅ ID image uploaded to Cloudinary:", idImageUrl);
      } catch (cloudinaryError) {
        console.error("❌ Error uploading ID image:", cloudinaryError);
        // Continue without ID image if upload fails
      }
    }

    // Adults and children are already parsed above
    const adultsCount = adults;
    const childrenCount = children;

    // Room numbers are not assigned at booking time - admin will assign later
    // No need to check room availability here since room_number will be NULL

    // Cache column existence checks
    const columnCache = {};
    const columnExists = async (columnName) => {
      if (columnCache[columnName] !== undefined) {
        return columnCache[columnName];
      }
      try {
        const [columns] = await db.query(
          "SHOW COLUMNS FROM bookings LIKE ?",
          [columnName]
        );
        columnCache[columnName] = columns.length > 0;
        return columnCache[columnName];
      } catch (error) {
        columnCache[columnName] = false;
        return false;
      }
    };

    const hasIdImage = await columnExists("id_image_url");
    const hasDiscountType = await columnExists("discount_type");
    const hasBasePrice = await columnExists("base_price");
    const hasDiscountAmount = await columnExists("discount_amount");
    const hasNotes = await columnExists("notes");

    const bookingsCreated = [];

    for (const currentRoomNumber of roomNumbers) {
      let insertQuery = `INSERT INTO bookings 
        (user_id, room_type_id, room_number, check_in, check_out, adults, children, total_price, payment_status, status`;
      let insertValues = [
        req.user.user_id || null,
        roomTypeId,
        currentRoomNumber || null,
        formattedCheckIn,
        formattedCheckOut,
        adultsCount,
        childrenCount,
        totalPrice,
        isPaid === "true" || isPaid === true ? "paid" : "unpaid",
        "Pending",
      ];
      let placeholders = Array(10).fill("?").join(", ");

      if (hasIdImage) {
        insertQuery += ", id_image_url";
        insertValues.push(idImageUrl);
        placeholders += ", ?";
      }
      if (hasDiscountType) {
        insertQuery += ", discount_type";
        insertValues.push(discountType || "None");
        placeholders += ", ?";
      }
      if (hasBasePrice) {
        insertQuery += ", base_price";
        insertValues.push(basePrice || totalPrice);
        placeholders += ", ?";
      }
      if (hasDiscountAmount) {
        insertQuery += ", discount_amount";
        insertValues.push(discountAmount || 0);
        placeholders += ", ?";
      }
      if (hasNotes) {
        const notesData = {
          guestName: guestName || "",
          phoneNumber: phoneNumber || "",
          address: address || "",
          nationality: nationality || "",
          deposit: deposit || 0,
          paymentMode: paymentMode || "Cash",
          signature: signature || "",
          remarks: remarks || "",
        };
        insertQuery += ", notes";
        insertValues.push(JSON.stringify(notesData));
        placeholders += ", ?";
      }

      insertQuery += `) VALUES (${placeholders})`;
      const [result] = await db.query(insertQuery, insertValues);

      bookingsCreated.push({
        booking_id: result.insertId,
        room_number: null, // Room number will be assigned by admin later
      });
    }

    //  Respond to frontend
    res.status(201).json({
      success: true,
      message: `✅ Booking request submitted successfully for ${bookingsCreated.length} room(s)! Room numbers will be assigned by the admin. You will receive a confirmation email once the admin confirms your booking.`,
      booking: bookingsCreated[0],
      bookings: bookingsCreated,
    });

    // Email will be sent when admin confirms the booking (in updateBookingStatus)
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "Error creating booking",
      error: error.message,
    });
  }
};

// API: Get all bookings of a user
// GET /api/bookings/user
export const getUserBookings = async (req, res) => {
  try {
    const pool = await connectDB();
    const userId = req.user.id;

    const [bookings] = await pool.query(
      `SELECT 
          b.booking_id,
          b.check_in AS checkInDate,
          b.check_out AS checkOutDate,
          b.total_price AS totalPrice,
          b.payment_status AS isPaid,
          r.room_type_id,
          r.room_number,
          rt.room_type_id,
          rt.type_name AS roomType,
          rt.capacity_adults,
          rt.capacity_children,
          rt.price_per_night
        FROM bookings b
        JOIN rooms r ON b.room_type_id = r.room_type_id
        JOIN room_types rt ON r.room_type_id = rt.room_type_id
        WHERE b.user_id = ?
        ORDER BY b.booking_id DESC;`,
      [userId]
    );

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user bookings",
    });
  }
};

// API: Get dashboard data (for owner/admin)
// GET /api/bookings/hotel
export const getHotelBookings = async (req, res) => {
  try {
    const pool = await connectDB();

    // Assuming only admins/owners can view all bookings
    const [bookings] = await pool.query(`
      SELECT 
        b.booking_id,
        b.total_price,
        b.check_in,
        b.check_out,
        r.room_number,
        rt.type_name AS roomType
      FROM bookings b
      JOIN rooms r ON b.room_type_id = r.room_type_id
      JOIN room_types rt ON r.room_type_id = rt.room_type_id
      ORDER BY b.booking_id DESC;
    `);

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce(
      (sum, b) => sum + Number(b.total_price),
      0
    );

    res.json({
      success: true,
      dashboardData: {
        totalBookings,
        totalRevenue,
        bookings,
      },
    });
  } catch (error) {
    console.error("Error fetching hotel bookings:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching hotel bookings",
    });
  }
};

// GET all bookings for ADMIN
export const getAllBookings = async (req, res) => {
  let connection;
  try {
    const pool = await connectDB(); // Get pool first
    connection = await pool.getConnection(); // Then get connection

    // Check if check_in_time and check_out_time columns exist
    let hasCheckInTime = false;
    let hasCheckOutTime = false;

    try {
      const [checkInCol] = await connection.query(
        "SHOW COLUMNS FROM bookings LIKE 'check_in_time'"
      );
      hasCheckInTime = checkInCol.length > 0;

      const [checkOutCol] = await connection.query(
        "SHOW COLUMNS FROM bookings LIKE 'check_out_time'"
      );
      hasCheckOutTime = checkOutCol.length > 0;
    } catch (error) {
      // Columns don't exist, continue without them
    }

    let timeColumns = "";
    if (hasCheckInTime) {
      timeColumns += ", b.check_in_time";
    }
    if (hasCheckOutTime) {
      timeColumns += ", b.check_out_time";
    }

    const sql = `
      SELECT 
        b.booking_id,
        u.full_name AS guest_name,
        u.email,
        rt.type_name AS room_type,
        b.room_number,
        b.check_in,
        b.check_out
        ${timeColumns},
        CONCAT('Adult ', b.adults, ' | Child ', b.children) AS guests,
        b.total_price,
        b.payment_status,
        b.status AS booking_status,
        b.created_at
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      JOIN room_types rt ON b.room_type_id = rt.room_type_id
      ORDER BY b.created_at DESC
    `;

    const [bookings] = await connection.query(sql);

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  } finally {
    if (connection) {
      connection.release(); // Release connection back to pool
    }
  }
};
// UPDATE booking status for admin 
export const updateBookingStatus = async (req, res) => {
  let connection;
  try {
    const { booking_id, action, datetime } = req.body;

    if (!booking_id || !action) {
      return res.status(400).json({
        success: false,
        message: "Missing booking_id or action",
      });
    }

    const actionLower = action.toLowerCase().trim();

    // Get pool first, then connection
    const pool = await connectDB();
    connection = await pool.getConnection();

    // Verify connection is established
    if (!connection) {
      throw new Error("Failed to establish database connection");
    }

    // Check and update payment_status enum if needed
    let allowedPaymentStatuses = [];
    try {
      const [columnInfo] = await connection.query(
        "SHOW COLUMNS FROM bookings WHERE Field = 'payment_status'"
      );

      if (columnInfo.length > 0 && columnInfo[0].Type) {
        const matches = columnInfo[0].Type.match(/'([^']+)'/g);
        if (matches) {
          allowedPaymentStatuses = matches.map((m) => m.replace(/'/g, ""));
        }

        // Update enum to only have 'Not paid' and 'Paid'
        if (
          !allowedPaymentStatuses.includes("Not paid") ||
          !allowedPaymentStatuses.includes("Paid")
        ) {
          try {
            await connection.query(
              "ALTER TABLE bookings MODIFY COLUMN payment_status ENUM('Not paid', 'Paid') DEFAULT 'Not paid'"
            );
            allowedPaymentStatuses = ["Not paid", "Paid"];
          } catch (error) {
            console.error("Failed to update payment_status enum:", error.message);
            // Fallback to default values
            allowedPaymentStatuses = ["Not paid", "Paid"];
          }
        }
      }
    } catch (error) {
      console.error("Failed to check payment_status enum:", error.message);
      allowedPaymentStatuses = ["Not paid", "Paid"];
    }

    if (allowedPaymentStatuses.length === 0) {
      allowedPaymentStatuses = ["Not paid", "Paid"];
    }

    await connection.beginTransaction();

    // Get current booking details
    const [current] = await connection.query(
      `
      SELECT 
        b.status, 
        b.payment_status,
        b.check_in,
        b.check_out,
        b.adults,
        b.children,
        b.total_price,
        u.full_name AS guest_name,
        u.email,
        b.room_number,
        rt.type_name AS room_type,
        rt.room_type_id
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      LEFT JOIN room_types rt ON rt.room_type_id = b.room_type_id
      WHERE b.booking_id = ?
      LIMIT 1
    `,
      [booking_id]
    );

    if (current.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const currentBooking = current[0];
    const currentStatus = currentBooking.status;
    const currentPaymentStatus = currentBooking.payment_status;
    let guestName = currentBooking.guest_name || "Guest";
    guestName = guestName.replace(/\s+/g, " ").trim();
    const email = currentBooking.email || "";
    const roomNumber = currentBooking.room_number || "";
    const roomType = currentBooking.room_type || "";
    const room = roomNumber
      ? `Room ${roomNumber}`
      : roomType
      ? roomType
      : "—";
    let checkOutDate = null;

    if (actionLower === "checkout" && datetime) {
      checkOutDate = new Date(datetime).toISOString().split("T")[0];
    }

    // Define status and payment transitions
    let newStatus = currentStatus;
    let newPaymentStatus = currentPaymentStatus;

    if (actionLower === "confirm") {
      newStatus = "Arrival";
      newPaymentStatus = "Paid";
    } else if (actionLower === "checkin") {
      newStatus = "Check-in";
      newPaymentStatus = currentPaymentStatus; // Keep current payment status
    } else if (actionLower === "checkout") {
      newStatus = "Check-out";
      newPaymentStatus = currentPaymentStatus; // Keep current payment status
    } else if (actionLower === "cancel") {
      newStatus = "Cancelled";
      newPaymentStatus = currentPaymentStatus;
    } else {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Invalid action",
      });
    }

    // Map payment status to storage-safe value
    let storagePaymentStatus = newPaymentStatus;
    if (!allowedPaymentStatuses.includes(newPaymentStatus)) {
      // Map old statuses to new ones
      if (newPaymentStatus === "Pending" || newPaymentStatus === "Not paid" || !newPaymentStatus) {
        storagePaymentStatus = "Not paid";
      } else if (newPaymentStatus === "Paid" || newPaymentStatus === "Partial Payment" || newPaymentStatus === "Payment Complete") {
        storagePaymentStatus = "Paid";
      } else {
        storagePaymentStatus = allowedPaymentStatuses[0]; // Default to "Not paid"
      }
    }

    // Check if check_in_time and check_out_time columns exist
    let hasCheckInTime = false;
    let hasCheckOutTime = false;
    try {
      const [checkInCol] = await connection.query(
        "SHOW COLUMNS FROM bookings LIKE 'check_in_time'"
      );
      hasCheckInTime = checkInCol.length > 0;

      const [checkOutCol] = await connection.query(
        "SHOW COLUMNS FROM bookings LIKE 'check_out_time'"
      );
      hasCheckOutTime = checkOutCol.length > 0;
    } catch (error) {
      console.error("Error checking time columns:", error);
    }

    // Map action to last_action value
    const lastActionMap = {
      confirm: "Confirm",
      checkin: "Check-in",
      checkout: "Check-out",
      cancel: "Cancel",
    };
    const lastAction = lastActionMap[actionLower] || "Unknown";

    // Update booking based on action
    if (actionLower === "checkin" && datetime) {
      // datetime is already in Manila time from client, just store it directly
      if (hasCheckInTime) {
        await connection.query(
          "UPDATE bookings SET status = ?, payment_status = ?, check_in_time = ? WHERE booking_id = ?",
          [newStatus, storagePaymentStatus, datetime, booking_id]
        );
      } else {
        await connection.query(
          "UPDATE bookings SET status = ?, payment_status = ? WHERE booking_id = ?",
          [newStatus, storagePaymentStatus, booking_id]
        );
      }
    } else if (actionLower === "checkout" && datetime) {
      // datetime is already in Manila time from client, just store it directly
      if (hasCheckOutTime) {
        await connection.query(
          "UPDATE bookings SET status = ?, payment_status = ?, check_out_time = ?, check_out = ? WHERE booking_id = ?",
          [newStatus, storagePaymentStatus, datetime, checkOutDate, booking_id]
        );
      } else {
        await connection.query(
          "UPDATE bookings SET status = ?, payment_status = ?, check_out = ? WHERE booking_id = ?",
          [newStatus, storagePaymentStatus, checkOutDate, booking_id]
        );
      }
    } else {
      const [result] = await connection.query(
        "UPDATE bookings SET status = ?, payment_status = ? WHERE booking_id = ?",
        [newStatus, storagePaymentStatus, booking_id]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(500).json({
          success: false,
          message: "Update failed",
          error: "No rows affected",
        });
      }
    }

    // Get actual check-in/check-out timestamps
    let logCheckIn = null;
    let logCheckOut = null;
    try {
      const [timeData] = await connection.query(
        "SELECT check_in_time, check_out_time FROM bookings WHERE booking_id = ?",
        [booking_id]
      );
      if (timeData.length > 0) {
        logCheckIn = timeData[0].check_in_time || null;
        logCheckOut = timeData[0].check_out_time || null;
      }
    } catch (error) {
      console.error("Error fetching time data:", error);
    }

    if (!logCheckIn) {
      logCheckIn =
        currentBooking.check_in || new Date().toISOString().split("T")[0];
    }
    if (!logCheckOut) {
      logCheckOut =
        currentBooking.check_out || new Date().toISOString().split("T")[0];
    }

    // Check if booking_logs has new schema
    let hasNewSchema = false;
    try {
      const [guestNameCol] = await connection.query(
        "SHOW COLUMNS FROM booking_logs LIKE 'guest_name'"
      );
      hasNewSchema = guestNameCol.length > 0;
    } catch (error) {
      console.error("Error checking booking_logs schema:", error);
    }

    // Generate Manila timezone timestamp for logging
    const getManilaTimestamp = () => {
      const manilaTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }));
      return manilaTime.toISOString().slice(0, 19).replace('T', ' ');
    };

    // Use provided datetime for check-in/check-out actions, otherwise generate current Manila time
    const actionTimestamp = (actionLower === 'checkin' || actionLower === 'checkout') && datetime 
      ? datetime 
      : getManilaTimestamp();

    if (hasNewSchema) {
      // Check for email and room_number columns
      let hasEmail = false;
      let hasRoomNumber = false;
      try {
        const [emailCol] = await connection.query(
          "SHOW COLUMNS FROM booking_logs LIKE 'email'"
        );
        hasEmail = emailCol.length > 0;

        const [roomCol] = await connection.query(
          "SHOW COLUMNS FROM booking_logs LIKE 'room_number'"
        );
        hasRoomNumber = roomCol.length > 0;
      } catch (error) {
        console.error("Error checking log columns:", error);
      }

      // Build dynamic INSERT query
      const columns = ["booking_id", "guest_name"];
      const values = [booking_id, guestName];
      const placeholders = ["?", "?"];

      if (hasEmail) {
        columns.push("email");
        values.push(email);
        placeholders.push("?");
      }

      if (hasRoomNumber) {
        columns.push("room_number");
        values.push(roomNumber || "");
        placeholders.push("?");
      }

      columns.push(
        "payment_status",
        "status",
        "room",
        "check_in",
        "check_out",
        "last_action",
        "action_timestamp",
        "performed_by"
      );
      values.push(
        storagePaymentStatus,
        newStatus,
        room,
        logCheckIn,
        logCheckOut,
        lastAction,
        actionTimestamp, // Now uses Manila time consistently
        "Admin"
      );
      placeholders.push("?", "?", "?", "?", "?", "?", "?", "?");

      const sql = `INSERT INTO booking_logs (${columns.join(
        ", "
      )}) VALUES (${placeholders.join(", ")})`;
      await connection.query(sql, values);
    } else {
      // Use NOW() which will respect the timezone setting
      await connection.query(
        "INSERT INTO booking_logs (booking_id, action, timestamp) VALUES (?, ?, NOW())",
        [booking_id, lastAction]
      );
    }

    await connection.commit();

    // Send confirmation email when admin confirms the booking (status changes to "Arrival")
    if (actionLower === "confirm" && newStatus === "Arrival" && email) {
      try {
        const reservationDetails = {
          bookingId: booking_id,
          checkInDate: currentBooking.check_in,
          checkOutDate: currentBooking.check_out,
          roomId: currentBooking.room_type_id,
          roomName: currentBooking.room_type || "Unknown Room",
          totalPrice: currentBooking.total_price || 0,
          guests: {
            adults: currentBooking.adults || 0,
            children: currentBooking.children || 0,
          },
          roomsBooked: [], // Don't include room numbers in confirmation email
        };

        await sendReservationEmail(email, reservationDetails);
        console.log(`✅ Confirmation email sent to ${email} for booking ${booking_id}`);
      } catch (emailError) {
        console.error("❌ Error sending confirmation email:", emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully.",
      status: newStatus,
      payment_status: newPaymentStatus,
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Rollback error:", rollbackError);
      }
    }
    console.error("Error updating booking status:", error);
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  } finally {
    // Release connection back to pool
    if (connection) {
      try {
        connection.release();
        console.log("Connection released back to pool");
      } catch (releaseError) {
        console.error("Error releasing connection:", releaseError);
      }
    }
  }
};

// GET booking logs with filters
export const getBookingLogs = async (req, res) => {
  let connection;
  try {
    const pool = await connectDB(); // Get pool first
    connection = await pool.getConnection(); // Then get connection

    // Build WHERE clause based on filters
    const where = [];
    const params = [];

    // Search filter
    if (req.query.search && req.query.search.trim() !== '') {
      const search = req.query.search.trim();
      where.push("(CAST(bl.log_id AS CHAR) LIKE ? OR bl.booking_id LIKE ? OR bl.guest_name LIKE ? OR bl.room LIKE ?)");
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }

    // Status filter
    if (req.query.status && req.query.status !== 'All') {
      where.push("bl.status = ?");
      params.push(req.query.status);
    }

    // Room type filter
    if (req.query.room_type && req.query.room_type !== 'All') {
      where.push("bl.room LIKE ?");
      params.push(`%${req.query.room_type}%`);
    }

    // Date from filter
    if (req.query.date_from && req.query.date_from.trim() !== '') {
      where.push("DATE(bl.check_in) >= ?");
      params.push(req.query.date_from);
    }

    // Date to filter
    if (req.query.date_to && req.query.date_to.trim() !== '') {
      where.push("DATE(bl.check_in) <= ?");
      params.push(req.query.date_to);
    }

    // Payment status filter
    if (req.query.payment_status && req.query.payment_status !== 'All') {
      where.push("bl.payment_status = ?");
      params.push(req.query.payment_status);
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    // Check if booking_logs has email column
    let hasEmail = false;
    try {
      const [emailCol] = await connection.query(
        "SHOW COLUMNS FROM booking_logs LIKE 'email'"
      );
      hasEmail = emailCol.length > 0;
    } catch (error) {
      // Column doesn't exist
    }

    // Check if booking_logs has room_number column
    let hasRoomNumber = false;
    try {
      const [roomCol] = await connection.query(
        "SHOW COLUMNS FROM booking_logs LIKE 'room_number'"
      );
      hasRoomNumber = roomCol.length > 0;
    } catch (error) {
      // Column doesn't exist
    }

    // Build SELECT columns dynamically
    let selectColumns = `
      bl.log_id,
      bl.booking_id,
      bl.guest_name,
      ${hasEmail ? 'bl.email' : "COALESCE(u.email, '') AS email"},
      bl.payment_status,
      bl.status,
      bl.room,
      ${hasRoomNumber ? 'bl.room_number,' : ''}
      b.room_type_id,
      rt.type_name AS room_type,
      bl.check_in,
      bl.check_out,
      bl.last_action,
      bl.action_timestamp,
      bl.performed_by
    `;

    const sql = `
      SELECT ${selectColumns}
      FROM booking_logs bl
      LEFT JOIN bookings b ON b.booking_id = bl.booking_id
      LEFT JOIN room_types rt ON rt.room_type_id = b.room_type_id
      ${hasEmail ? '' : 'LEFT JOIN users u ON u.user_id = b.user_id'}
      ${whereClause}
      ORDER BY bl.action_timestamp DESC
      LIMIT 500
    `;

    const [logs] = await connection.query(sql, params);

    res.status(200).json({
      success: true,
      data: logs
    });

  } catch (error) {
    console.error("Error fetching booking logs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking logs",
      error: error.message
    });
  } finally {
    if (connection) {
      connection.release();
      console.log("Connection released");
    }
  }
};

// Export booking logs as CSV (no auth required)
export const exportBookingLogs = async (req, res) => {
  let connection;
  try {
    const pool = await connectDB(); // Get pool first
    connection = await pool.getConnection(); // Then get connection

    // Build WHERE clause based on filters (same as getBookingLogs)
    const where = [];
    const params = [];

    if (req.query.search && req.query.search.trim() !== '') {
      const search = req.query.search.trim();
      where.push("(CAST(bl.log_id AS CHAR) LIKE ? OR bl.booking_id LIKE ? OR bl.guest_name LIKE ? OR bl.room LIKE ?)");
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }

    if (req.query.status && req.query.status !== 'All') {
      where.push("bl.status = ?");
      params.push(req.query.status);
    }

    if (req.query.room_type && req.query.room_type !== 'All') {
      where.push("bl.room LIKE ?");
      params.push(`%${req.query.room_type}%`);
    }

    if (req.query.date_from && req.query.date_from.trim() !== '') {
      where.push("DATE(bl.check_in) >= ?");
      params.push(req.query.date_from);
    }

    if (req.query.date_to && req.query.date_to.trim() !== '') {
      where.push("DATE(bl.check_in) <= ?");
      params.push(req.query.date_to);
    }

    if (req.query.payment_status && req.query.payment_status !== 'All') {
      where.push("bl.payment_status = ?");
      params.push(req.query.payment_status);
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const sql = `
      SELECT 
        bl.log_id,
        bl.booking_id,
        bl.guest_name,
        bl.payment_status,
        bl.status,
        bl.room,
        bl.check_in,
        bl.check_out,
        bl.last_action,
        bl.action_timestamp,
        bl.performed_by
      FROM booking_logs bl
      ${whereClause}
      ORDER BY bl.action_timestamp DESC
    `;

    const [logs] = await connection.query(sql, params);

    // Generate CSV content
    const headers = [
      'Log ID',
      'Booking ID',
      'Guest Name',
      'Payment Status',
      'Status',
      'Room',
      'Check-In',
      'Check-Out',
      'Last Action',
      'Timestamp',
      'Performed By'
    ];

    // CSV helper function to escape fields
    const escapeCSV = (field) => {
      if (field === null || field === undefined) return '';
      const str = String(field);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Build CSV content
    let csvContent = headers.join(',') + '\n';

    logs.forEach(log => {
      const row = [
        log.log_id,
        log.booking_id,
        log.guest_name,
        log.payment_status,
        log.status,
        log.room,
        log.check_in,
        log.check_out,
        log.last_action,
        log.action_timestamp,
        log.performed_by
      ].map(escapeCSV);

      csvContent += row.join(',') + '\n';
    });

    // Generate filename with current timestamp
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `booking_logs_${timestamp}.csv`;

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    res.status(200).send(csvContent);

  } catch (error) {
    console.error("Error exporting booking logs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export booking logs",
      error: error.message
    });
  } finally {
    if (connection) {
      connection.release();
      console.log("Connection released");
    }
  }
};

//Calendar Room matrix
// GET: Calendar bookings for admin
export const adminGetCalendarBookings = async (req, res) => {
  try {
    const db = await connectDB();
    
    const [bookings] = await db.query(`
      SELECT 
        b.booking_id as id,
        b.room_number,
        b.check_in,
        b.check_out,
        b.user_id,
        b.room_type_id,
        b.status,
        b.adults,
        b.children,
        b.notes,
        u.full_name as guest_name,
        'Direct' as booking_source
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.user_id
      WHERE b.status IN ('confirmed', 'checked-in', 'pending')
      ORDER BY b.check_in
    `);
    // Transform the data to match what the frontend expects
    const transformedBookings = bookings.map(booking => ({
      id: booking.id,
      room_number: booking.room_number,
      checkIn: booking.check_in,
      checkOut: booking.check_out,
      guest: booking.guest_name || booking.notes || 'Guest',
      source: booking.booking_source || 'Direct',
      status: booking.status
    }));

    res.json(transformedBookings);
  } catch (err) {
    console.error("Error fetching calendar bookings:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET: Get all bookings for a specific booking group (by user email and dates)
export const getBookingGroup = async (req, res) => {
  try {
    const db = await connectDB();
    const { booking_id } = req.params;

    // Get the primary booking to find related bookings
    const [primaryBooking] = await db.query(
      `SELECT b.*, u.email, u.full_name, u.phone, rt.type_name AS room_type
       FROM bookings b
       JOIN users u ON b.user_id = u.user_id
       JOIN room_types rt ON b.room_type_id = rt.room_type_id
       WHERE b.booking_id = ?`,
      [booking_id]
    );

    if (primaryBooking.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const primary = primaryBooking[0];

    // Find all bookings with same email, check-in, and check-out (regardless of room type)
    // Include all statuses (Pending, Arrival, Check-in) to get the full booking group
    const [relatedBookings] = await db.query(
      `SELECT b.*, rt.type_name AS room_type, rt.room_type_id
       FROM bookings b
       JOIN room_types rt ON b.room_type_id = rt.room_type_id
       JOIN users u ON b.user_id = u.user_id
       WHERE u.email = ? 
       AND b.check_in = ? 
       AND b.check_out = ?
       AND b.status IN ('Pending', 'Arrival', 'Check-in')
       ORDER BY rt.type_name, b.booking_id`,
      [primary.email, primary.check_in, primary.check_out]
    );

    // Calculate total price from all related bookings
    const totalPrice = relatedBookings.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);

    res.json({
      success: true,
      bookings: relatedBookings,
      guestName: primary.full_name,
      email: primary.email,
      phone: primary.phone || '',
      roomType: relatedBookings.length > 0 && new Set(relatedBookings.map(b => b.room_type)).size === 1
        ? relatedBookings[0].room_type
        : 'Multiple Types',
      checkIn: primary.check_in,
      checkOut: primary.check_out,
      totalPrice: totalPrice,
    });
  } catch (error) {
    console.error("Error fetching booking group:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking group",
      error: error.message,
    });
  }
};

// POST: Assign room numbers to bookings
export const assignRoomNumbers = async (req, res) => {
  let connection;
  try {
    const { booking_ids, room_numbers } = req.body;

    if (!booking_ids || !Array.isArray(booking_ids) || booking_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "booking_ids array is required",
      });
    }

    if (!room_numbers || !Array.isArray(room_numbers) || room_numbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "room_numbers array is required",
      });
    }

    if (booking_ids.length !== room_numbers.length) {
      return res.status(400).json({
        success: false,
        message: "booking_ids and room_numbers arrays must have the same length",
      });
    }

    const pool = await connectDB();
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Update each booking with its assigned room number
    for (let i = 0; i < booking_ids.length; i++) {
      const bookingId = booking_ids[i];
      const roomNumber = room_numbers[i];

      if (!roomNumber || roomNumber.trim() === "") {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Room number is required for booking ${bookingId}`,
        });
      }

      // Check if room is available for the booking dates
      const [booking] = await connection.query(
        `SELECT check_in, check_out, room_type_id FROM bookings WHERE booking_id = ?`,
        [bookingId]
      );

      if (booking.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: `Booking ${bookingId} not found`,
        });
      }

      const { check_in, check_out, room_type_id } = booking[0];

      // Check if room exists and is of correct type
      const [room] = await connection.query(
        `SELECT room_id, room_type_id, status FROM rooms WHERE room_number = ?`,
        [roomNumber]
      );

      if (room.length === 0) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Room ${roomNumber} not found`,
        });
      }

      if (room[0].room_type_id !== room_type_id) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Room ${roomNumber} is not of the correct room type`,
        });
      }

      // Check if room is already booked for these dates
      const [existingBookings] = await connection.query(
        `SELECT booking_id FROM bookings 
         WHERE room_number = ? 
         AND booking_id != ?
         AND (
           (check_in <= ? AND check_out >= ?) OR
           (check_in <= ? AND check_out >= ?) OR
           (? <= check_in AND ? >= check_out)
         )`,
        [roomNumber, bookingId, check_in, check_in, check_out, check_out, check_in, check_out]
      );

      if (existingBookings.length > 0) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Room ${roomNumber} is already booked for the selected dates`,
        });
      }

      // Update booking with room number
      await connection.query(
        `UPDATE bookings SET room_number = ? WHERE booking_id = ?`,
        [roomNumber, bookingId]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: `Room numbers assigned successfully to ${booking_ids.length} booking(s)`,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error assigning room numbers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to assign room numbers",
      error: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// GET: Get available rooms for a room type and date range
export const getAvailableRoomsForBooking = async (req, res) => {
  try {
    const db = await connectDB();
    const { room_type_id, check_in, check_out } = req.query;

    if (!room_type_id || !check_in || !check_out) {
      return res.status(400).json({
        success: false,
        message: "room_type_id, check_in, and check_out are required",
      });
    }

    // Get all available rooms of this type
    const [availableRooms] = await db.query(
      `SELECT r.room_id, r.room_number, r.status, rt.type_name
       FROM rooms r
       JOIN room_types rt ON r.room_type_id = rt.room_type_id
       WHERE r.room_type_id = ? AND r.status = 'available'
       ORDER BY r.room_number`,
      [room_type_id]
    );

    // Filter out rooms that are already booked for the selected dates
    const filteredRooms = [];
    for (const room of availableRooms) {
      const [existingBookings] = await db.query(
        `SELECT booking_id FROM bookings
         WHERE room_number = ?
         AND (
           (check_in <= ? AND check_out >= ?) OR
           (check_in <= ? AND check_out >= ?) OR
           (? <= check_in AND ? >= check_out)
         )`,
        [room.room_number, check_in, check_in, check_out, check_out, check_in, check_out]
      );

      if (existingBookings.length === 0) {
        filteredRooms.push(room);
      }
    }

    res.json({
      success: true,
      rooms: filteredRooms,
      count: filteredRooms.length,
    });
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch available rooms",
      error: error.message,
    });
  }
};