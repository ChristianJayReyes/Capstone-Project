import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserData, getUserProfile, storeRecentSearchedCities, updateUserProfile } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/', protect, getUserData);
userRouter.get('/profile', protect, getUserProfile);
userRouter.post('/store-recent-search', protect, storeRecentSearchedCities);
userRouter.put('/update-profile', protect, updateUserProfile);


export default userRouter; 