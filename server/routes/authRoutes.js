// routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "../configs/db.js";
import nodemailer from "nodemailer";
import passport from "passport";
import fetch from "node-fetch";
import crypto from "crypto";

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
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
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

// --- Login ---
router.post("/login", async (req, res) => {
  const { email, password, captcha } = req.body;

  try {
    const secretKey = process.env.CAPTCHA_SECRET_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;
    const captchaResponse = await fetch(verifyUrl, { method: "POST" });
    const captchaData = await captchaResponse.json();

    if (!captchaData.success) {
      return res.status(400).json({ success: false, message: "Captcha verification failed. Please try again."});
    }
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Log for debugging only
    const user = rows[0];
    console.log("Received password:", password, typeof password);
    console.log("Stored password:", user.password, typeof user.password);

    const plainPassword =
      typeof password === "object" && password !== null
        ? password.toString()
        : password;

    const storedPassword =
      typeof user.password === "object" && user.password !== null
        ? user.password.toString()
        : user.password;

    // Compare passwords
    const isMatch = await bcrypt.compare(plainPassword, storedPassword);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
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
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    const user = rows[0];

    // Clear OTP after success
    await db.query(
      "UPDATE users SET otp = NULL, otp_expires = NULL WHERE user_id = ?",
      [user.user_id]
    );

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
  passport.authenticate("google", { scope: ["profile", "email"], state: true })
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

    // Send back both token + user
    const userData = encodeURIComponent(JSON.stringify(req.user));

    // redirect to frontend with both
    res.redirect(`https://rosario-resort-and-hotel.vercel.app?token=${token}&user=${userData}`);
  }
);

// Admin login route
router.post("/admin-login", (req, res) => {
  const { email, password } = req.body;

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email, role: "hotelAdmin", name: "Admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      success:true,
      token,
      user: { email, role: "hotelAdmin", name: "Admin"},
    });
  } else {
    return res.status(401).json({ success: false, message: "Invalid credentials"});
  }
});

// --- Forgot Password ---
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      // Don't reveal if email exists for security
      return res.json({
        success: true,
        message: "If that email exists, a password reset link has been sent.",
      });
    }

    const user = rows[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

    // Check if reset_token columns exist, if not add them
    try {
      // Try to update first - if columns don't exist, this will fail
      await db.query(
        "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE user_id = ?",
        [resetToken, resetTokenExpires, user.user_id]
      );
    } catch (updateErr) {
      // If columns don't exist, add them
      if (updateErr.code === "ER_BAD_FIELD_ERROR") {
        try {
          // Check if reset_token column exists
          const [columns] = await db.query(
            "SHOW COLUMNS FROM users LIKE 'reset_token'"
          );
          if (columns.length === 0) {
            await db.query(
              "ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) NULL"
            );
            console.log("✅ Added reset_token column");
          }

          // Check if reset_token_expires column exists
          const [expiresColumns] = await db.query(
            "SHOW COLUMNS FROM users LIKE 'reset_token_expires'"
          );
          if (expiresColumns.length === 0) {
            await db.query(
              "ALTER TABLE users ADD COLUMN reset_token_expires DATETIME NULL"
            );
            console.log("✅ Added reset_token_expires column");
          }

          // Try update again after adding columns
          await db.query(
            "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE user_id = ?",
            [resetToken, resetTokenExpires, user.user_id]
          );
        } catch (alterErr) {
          console.error("❌ Error adding/updating columns:", alterErr);
          throw new Error(`Database error: ${alterErr.message}`);
        }
      } else {
        // Different error, re-throw it
        console.error("❌ Error updating reset token:", updateErr);
        throw updateErr;
      }
    }

    // Create reset URL
    const resetUrl = `https://rosario-resort-and-hotel.vercel.app/reset-password?token=${resetToken}`;

    // Send reset email
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Email credentials not configured");
        return res.status(500).json({
          success: false,
          message: "Email service not configured. Please contact support.",
        });
      }

      await transporter.sendMail({
        from: `"Rosario Resorts and Hotel" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "🔐 Password Reset Request - Rosario Resorts and Hotel",
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f4; padding: 40px 0; text-align: center;">
            <div style="max-width: 480px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
              
              <div style="background: linear-gradient(135deg, #0077b6, #0096c7); color: #fff; padding: 20px;">
                <h1 style="margin: 0; font-size: 22px;">Rosario Resorts and Hotel</h1>
              </div>

              <div style="padding: 30px 25px;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p style="font-size: 16px; color: #555;">You requested to reset your password. Click the button below to reset it:</p>

                <div style="margin: 25px 0;">
                  <a href="${resetUrl}" style="display: inline-block; background-color: #0077b6; color: #fff; font-size: 16px; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                    Reset Password
                  </a>
                </div>

                <p style="font-size: 14px; color: #777;">
                  Or copy and paste this link into your browser:<br/>
                  <a href="${resetUrl}" style="color: #0077b6; word-break: break-all;">${resetUrl}</a>
                </p>

                <p style="font-size: 14px; color: #777; margin-top: 20px;">
                  This link will expire in <strong>1 hour</strong>. If you didn't request this, please ignore this email.
                </p>
              </div>

              <div style="background: #f1f1f1; padding: 12px; font-size: 12px; color: #888;">
                © 2025 Rosario Resorts and Hotel<br/>
                <span>All rights reserved.</span>
              </div>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Error sending email:", emailErr);
      return res.status(500).json({
        success: false,
        message: "Failed to send email. Please try again later.",
      });
    }

    res.json({
      success: true,
      message: "Password reset link has been sent to your email.",
      resetToken, // Include token for direct reset (optional, for testing)
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    console.error("Error details:", {
      message: err.message,
      code: err.code,
      sql: err.sql,
      stack: err.stack,
    });
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// --- Reset Password ---
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Token and new password are required" });
    }

    const db = await connectDB();

    // Find user with valid reset token
    const [rows] = await db.query(
      "SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > UTC_TIMESTAMP()",
      [token]
    );

    if (rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    const user = rows[0];

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await db.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE user_id = ?",
      [hashedPassword, user.user_id]
    );

    res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;