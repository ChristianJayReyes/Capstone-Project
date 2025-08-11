import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database Connected")
    );

    const db = mongoose.connection;
    db.on("error", (err)=> {
      console.error("Database connection error:", err);
    });
    db.on("connected", () => {
      console.log(`Connected to DB: ${db.name}`);
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
