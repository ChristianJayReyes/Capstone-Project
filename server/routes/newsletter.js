import express from "express";
import connectDB from "../configs/db.js";

const router = express.Router();

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email address." });
  }

  try {
    const db = await connectDB();

    // Check if the email already exists
    const [existing] = await db.query("SELECT * FROM subscribers WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already subscribed." });
    }

    // Insert new subscriber
    await db.query("INSERT INTO subscribers (email) VALUES (?)", [email]);

    res.status(200).json({ message: "Thank you for subscribing!" });
  } catch (error) {
    console.error("Error adding subscriber:", error);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;
