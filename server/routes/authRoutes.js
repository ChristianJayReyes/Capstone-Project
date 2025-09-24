// routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "../configs/db.js";
import nodemailer from "nodemailer";
import passport from "passport";

const router = express.Router();

// --- Email Sender (Nodemailer) ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- Register ---
router.post("/register", async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    const db = await connectDB();
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",
      [full_name, email, hashedPassword]
    );

    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- Login (Step 1: Send OTP) ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    await db.query(
      "UPDATE users SET otp = ?, otp_expires = DATE_ADD(UTC_TIMESTAMP(), INTERVAL 5 MINUTE) WHERE user_id = ?",
      [otp, user.user_id]
    );

    // Send OTP email
    await transporter.sendMail({
      from: `"Rosario Resorts" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Login Verification Code",
      html: `<p>Use the following code to verify your login:</p>
             <h2>${otp}</h2>
             <p>This code will expire in 5 minutes.</p>`,
    });

    // Return user_id so frontend can use it
    res.json({
      success: true,
      message: "OTP sent to your email",
      user_id: user.user_id,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- Verify OTP (Step 2: Complete Login) ---
router.post("/verify-otp", async (req, res) => {
  const { user_id, email, otp } = req.body;

  try {
    const db = await connectDB();

    // MySQL directly checks OTP validity + expiry
    const [rows] = await db.query(
      "SELECT * FROM users WHERE (user_id = ? OR email = ?) AND otp = ? AND otp_expires > UTC_TIMESTAMP()",
      [user_id || null, email || null, otp]
    );

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const user = rows[0];

    // Clear OTP after success
    await db.query("UPDATE users SET otp = NULL, otp_expires = NULL WHERE user_id = ?", [user.user_id]);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ success: true, message: "Login successful", token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- Google OAuth ---
// Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // generate JWT
    const token = jwt.sign(
      { id: req.user.user_id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 👇 Send back both token + user
    const userData = encodeURIComponent(JSON.stringify(req.user));

    // redirect to frontend with both
    res.redirect(`http://localhost:5173?token=${token}&user=${userData}`);
  }
);

export default router;
