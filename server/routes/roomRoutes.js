import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { createRoom, 
  getOwnerRooms, 
  getRooms, 
  checkRoomAvailability,
  adminGetRooms,
  adminAddRoom,
  adminUpdateRoom,
  adminDeleteRoom,
  getAvailableRoomsByType
} from "../controllers/roomController.js";

const roomRouter = express.Router();
roomRouter.route("/").post(protect, upload.array("images",4), createRoom).get(getRooms);
roomRouter.route("/owner").get(protect, getOwnerRooms);
roomRouter.get("/check/:room_number", checkRoomAvailability);
roomRouter.get("/available", getAvailableRoomsByType);

// =================== ADMIN ROUTES ===================
roomRouter.get("/admin/getRooms", adminGetRooms);
roomRouter.post("/admin/addRoom", adminAddRoom);
roomRouter.post("/admin/updateRoom", adminUpdateRoom);
roomRouter.post("/admin/deleteRoom", adminDeleteRoom);


export default roomRouter;