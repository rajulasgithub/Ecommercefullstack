import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("Database is connected");
    console.log(process.env.MONGO_URL);
    return conn;
  } catch (error) {
    console.log(error);
    console.log("Database not connected");
  }
};

export default connectDB;
