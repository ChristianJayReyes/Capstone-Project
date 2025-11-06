import express from "express";
import connectDB from "../configs/db.js"; // make sure this is your correct path

const router = express.Router();

router.post("/", async (req, res) => {
  const {
    customer_name,
    email,
    contact_number,
    special_request,
    event_start_date,
    event_end_date,
  } = req.body;

  if (!customer_name || !email || !contact_number) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const db = await connectDB();

    await db.query(
      "INSERT INTO event_bookings (customer_name, email, contact_number, special_request, event_start_date, event_end_date) VALUES (?, ?, ?, ?, ?, ?)",
      [
        customer_name,
        email,
        contact_number,
        special_request,
        event_start_date,
        event_end_date,
      ]
    );

    res.status(201).json({ message: "Event booking saved successfully!" });
  } catch (error) {
    console.error("❌ Database Error:", error);
    res.status(500).json({ message: "Database error occurred." });
  }
});

export default router;
