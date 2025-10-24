import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", 
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Generate JWT
    const token = jwt.sign(
      { id: req.user.user_id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } 
    );

    // Redirect with token to frontend
    res.redirect(`http://localhost:5173/login?token=${token}`);
  }
);

export default router;
