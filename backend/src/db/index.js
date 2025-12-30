import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({});
export const connectDb = async function () {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDb connection Sucessfull !!!")
  } catch (error) {
    console.log("Failed to Connect Database ", error);
    process.exit(1)
  }
};
