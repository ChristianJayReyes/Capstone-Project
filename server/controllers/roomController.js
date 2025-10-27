
import { v2 as cloudinary } from "cloudinary";
import connectDB from "../configs/db.js";

//Api to create new room for the hotel
export const createRoom = async (req, res) => {
    try {
        const {roomType, pricePerNight, amenities} = req.body;
        const hotel = await Hotel.findOne({owner: req.auth.userId})

        if (!hotel){
            return res.json({
                success: false,
                message: "Hotel not found"
            })
        }
        const uploadImages = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        })

        const images = await Promise.all(uploadImages)

        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            images,
        })
        res.json({
            success:true,
            message:"Room created successfully"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}
//Api to get all rooms of the hotel
export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({isAvailable: true}).populate({
            path: "hotel",
            populate: {
                path: "owner",
                select: 'image'
            }
        }).sort({createdAt: -1});
        res.json({
            success:true,
            rooms
        })      
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}
//API to get all rooms for a specific hotel
export const getOwnerRooms = async (req, res) => {
    try {
        const hotelData = await Hotel({owner: req.auth.userId})
        const rooms = await Room.find({hotel: hotelData._id.toString()}).populate("hotel");
        res.json ({
            success: true,
            rooms
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}
//API to toggle availability of a room
export const checkRoomAvailability = async (req, res) => {
  try {
    const { room_number } = req.params;

    const db = await connectDB();

    const [results] = await db.query("SELECT * FROM rooms WHERE room_number = ?", [room_number]);

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    const room = results[0];
 
    if (room.status !== "available") {
      return res.json({
        success: false,
        message: "This room is not available for the following days.",
      });
    }

    return res.json({
      success: true,
      message: "Room is available",
      room,
    });
  } catch (error) {
    console.error("❌ Error checking room:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};