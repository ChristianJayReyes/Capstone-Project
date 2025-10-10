import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createRoom, updateRoom, getOwnerRooms, getRooms, toggleRoomAvailability } from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.post('/', protect, createRoom); // JSON only
roomRouter.put('/:id', protect, updateRoom); // JSON only
roomRouter.get('/', getRooms);
roomRouter.get('/owner', protect, getOwnerRooms);
roomRouter.post('/toggle-availability', protect, toggleRoomAvailability);

export default roomRouter;
