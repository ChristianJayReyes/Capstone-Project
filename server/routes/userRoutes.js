import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserData, storeRecentSearchedRooms } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/', protect, getUserData);
userRouter.post('/store-recent-search', protect, storeRecentSearchedRooms);


export default userRouter;