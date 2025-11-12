import express from "express";
import mysql from "mysql2/promise";

const router = express.Router();

// ✅ Create a connection pool (replace with your DB credentials)
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // your MySQL password
  database: "your_database_name",
});

// ✅ GET /api/bookings
router.get("/bookings", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    // Check if columns exist
    let hasCheckInTime = false;
    let hasCheckOutTime = false;

    const [checkInCols] = await connection.query(
      "SHOW COLUMNS FROM bookings LIKE 'check_in_time'"
    );
    hasCheckInTime = checkInCols.length > 0;

    const [checkOutCols] = await connection.query(
      "SHOW COLUMNS FROM bookings LIKE 'check_out_time'"
    );
    hasCheckOutTime = checkOutCols.length > 0;

    // Build column list dynamically
    let timeColumns = "";
    if (hasCheckInTime) timeColumns += ", b.check_in_time";
    if (hasCheckOutTime) timeColumns += ", b.check_out_time";

    // Query bookings
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
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: err.message,
    });
  } finally {
    connection.release();
  }
});

export default router;
