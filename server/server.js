// server.js

import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from "./controllers/clerkWebhooks.js";

connectDB();

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

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
