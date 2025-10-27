// server/controllers/bookingController.js
import connectDB from "../configs/db.js";
import { sendReservationEmail } from "../utils/reservationEmail.js";

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
    const {
      email,
      roomId,
      checkInDate,
      checkOutDate,
      guests,
      totalPrice,
      isPaid,
    } = req.body;

    console.log("📥 Received booking data:", req.body);

    const db = await connectDB();

    // ✅ Convert ISO date to MySQL DATE format (YYYY-MM-DD)
    const formatDate = (date) => new Date(date).toISOString().slice(0, 10);
    const formattedCheckIn = formatDate(checkInDate);
    const formattedCheckOut = formatDate(checkOutDate);

    // ✅ Extract adults and children
    const adults = parseInt(guests.adults) || 0;
    const children = parseInt(guests.children) || 0;

    // ✅ Check if the room is already booked within the selected range
    const [existingBookings] = await db.query(
      `SELECT * FROM bookings
       WHERE room_type_id = ?
       AND (
         (check_in <= ? AND check_out >= ?) OR
         (check_in <= ? AND check_out >= ?) OR
         (? <= check_in AND ? >= check_out)
       )`,
      [
        roomId,
        formattedCheckIn,
        formattedCheckIn,
        formattedCheckOut,
        formattedCheckOut,
        formattedCheckIn,
        formattedCheckOut,
      ]
    );

    if (existingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: "❌ This room is already booked for the selected dates.",
      });
    }

    // ✅ Insert new booking record
    const [result] = await db.query(
      `INSERT INTO bookings 
        (user_id, email, room_type_id, check_in, check_out, adults, children, total_price, payment_status, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.user_id || null,
        email,
        roomId,
        formattedCheckIn,
        formattedCheckOut,
        adults,
        children,
        totalPrice,
        isPaid ? "paid" : "unpaid",
        "pending",
      ]
    );

    // ✅ Respond to frontend
    res.status(201).json({
      success: true,
      message: "✅ Booking created successfully!",
      booking: {
        booking_id: result.insertId,
        user_id: req.user.user_id || null,
        user_email: req.user.email,
        room_type_id: roomId,
        check_in: formattedCheckIn,
        check_out: formattedCheckOut,
        adults,
        children,
        total_price: totalPrice,
        payment_status: isPaid ? "paid" : "unpaid",
      },
    });

    // Send email to the user
    // const pool = await connectDB();
    // const [roomRows] = await pool.query(
    //   "SELECT name FROM rooms WHERE room_type_id=?",
    //   [roomId]
    // );
    // const roomName = roomRows.length > 0 ? roomRows[0].name : "Unknown Room";

    const reservationDetails = {
      bookingId: result.insertId,
      checkInDate: formattedCheckIn,
      checkOutDate: formattedCheckOut,
      roomType: roomId,
      totalPrice,
      guests: {
        adults,
        children, 
      },
    };
    await sendReservationEmail(email, reservationDetails);
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
