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

    // Fetch user from DB using decoded id (works for both regular users and database admin users)
    if (decoded.id) {
      const db = await connectDB();
      const [rows] = await db.query("SELECT * FROM users WHERE user_id = ?", [
        decoded.id,
      ]);

      if (rows.length === 0) {
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }

      const user = rows[0];
      
      // Check if user is admin (from database)
      if (user.role === "hotelAdmin" || user.role === "admin") {
        req.user = {
          ...user,
          user_id: user.user_id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
        };
        return next();
      }

      // Regular user
      req.user = {
        ...user,
        user_id: decoded.id,
        email: decoded.email || decoded.user_email || user.email,
      };
      return next();
    }

    // Legacy admin token (without id) - for backward compatibility
    if (decoded.role === "hotelAdmin" || decoded.role === "admin") {
      req.user = {
        email: decoded.email,
        role: decoded.role,
        full_name: decoded.name || "Admin",
        user_id: null,
      };
      return next();
    }

    // Invalid token format
    return res
      .status(401)
      .json({ success: false, message: "Invalid token format" });
  } catch (err) {
    console.error("JWT Error:", err);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
