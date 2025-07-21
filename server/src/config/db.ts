import dotenv from "dotenv";
dotenv.config();

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log("MONGO_URI", process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error(`Unexpected error: ${error}`);
    }

    process.exit(1);
  }
};

export default connectDB;

