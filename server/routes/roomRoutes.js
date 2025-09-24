import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { createRoom, getOwnerRooms, getRooms, toggleRoomAvailability } from "../controllers/roomController.js";

const roomRouter = express.Router();
roomRouter.route("/").post(protect, upload.array("images",4), createRoom).get(getRooms);
roomRouter.route("/owner").get(protect, getOwnerRooms);
roomRouter.route("/:id/availability").patch(protect,toggleRoomAvailability);

export default roomRouter;
