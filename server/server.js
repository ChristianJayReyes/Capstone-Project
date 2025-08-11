// server.js

import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";


connectDB();
connectCloudinary();

const app = express();
app.use(cors());

// Enable JSON parsing
app.use(express.json());

//Clerk middleware applies only for user-authenticated routes
app.use(clerkMiddleware());

// Register Clerk Webhook BEFORE applying clerkMiddleware
app.use("/api/clerk", clerkWebhooks);

// Test route
app.get("/", (req, res) => res.send("API is working fine"));
app.use('/api/user', userRouter);
app.use('/api/hotel', hotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings', bookingRouter);

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
