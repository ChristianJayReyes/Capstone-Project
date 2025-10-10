// server/configs/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import connectDB from "./db.js";
import jwt from "jsonwebtoken";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = await connectDB();

        // check if user exists
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
          profile.emails[0].value,
        ]);

        let user;
        if (rows.length > 0) {
          // update photo every login (keeps in sync with Gmail)
          await db.query("UPDATE users SET photo = ? WHERE user_id = ?", [
            profile.photos[0].value,
            rows[0].user_id,
          ]);
          const [updatedUser] = await db.query(
            "SELECT * FROM users WHERE user_id = ?",
            [rows[0].user_id]
          );
          user = updatedUser[0];
        } else {
          //  insert new Google user
          const [result] = await db.query(
            "INSERT INTO users (full_name, email, photo) VALUES (?, ?, ?)",
            [
              profile.displayName,
              profile.emails[0].value,
              profile.photos[0].value,
            ]
          );
          const [newUser] = await db.query(
            "SELECT * FROM users WHERE user_id = ?",
            [result.insertId]
          );
          user = newUser[0];
        }

        //  Generate Access Token
        const appAccessToken = jwt.sign(
          { userId: user.user_id },
          process.env.JWT_SECRET,
          { expiresIn: "3d" } // 3 days
        );

        //  Generate Refresh Token
        const appRefreshToken = jwt.sign(
          { userId: user.user_id },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: "30d" }
        );

        //  Store refresh token in DB
        await db.query("UPDATE users SET refresh_token = ? WHERE user_id = ?", [
          appRefreshToken,
          user.user_id,
        ]);

        // return user with both tokens
        return done(null, {
          ...user,
          accessToken: appAccessToken,
          refreshToken: appRefreshToken,
        });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// required for sessions
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM users WHERE user_id = ?", [
      id,
    ]);
    done(null, rows[0]);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
