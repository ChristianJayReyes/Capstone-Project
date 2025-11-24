// middleware/authMiddleware.js
import jwt, { decode } from "jsonwebtoken";
import connectDB from "../configs/db.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Admin Bypass
  if (req.headers["x-admin-key"] === "your-admin-secret") {
    req.user = { role: "admin", full_name: "Admin" };
    return next();
  }

  // JWT Protection
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if this is an admin token (from admin-login)
    // Admin tokens have role: "hotelAdmin" and don't have an id field
    if (decoded.role === "hotelAdmin") {
      // Admin user - skip database lookup
      req.user = {
        email: decoded.email,
        role: decoded.role,
        full_name: decoded.name || "Admin",
        user_id: null, // Admin doesn't have a user_id in the users table
      };
      return next();
    }

    // Regular user token - must have id field
    if (!decoded.id) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token format" });
    }

    // Fetch user from DB using decoded id
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM users WHERE user_id = ?", [
      decoded.id,
    ]);

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    req.user = {...rows[0], user_id: decoded.id, email: decoded.email || decoded.user_email,}; 
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
