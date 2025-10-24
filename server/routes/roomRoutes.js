import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { createRoom, getOwnerRooms, getRooms, checkRoomAvailability } from "../controllers/roomController.js";

const roomRouter = express.Router();
roomRouter.route("/").post(protect, upload.array("images",4), createRoom).get(getRooms);
roomRouter.route("/owner").get(protect, getOwnerRooms);
roomRouter.get("/check/:room_number", checkRoomAvailability);

export default roomRouter;
 