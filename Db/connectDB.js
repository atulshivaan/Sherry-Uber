import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("\x1b[32m✔ MongoDB Connected:\x1b[0m", conn.connection.host);
  } catch (error) {
    console.error("\x1b[31m✖ Error Connecting to MongoDB:\x1b[0m", error.message);
    process.exit(1); // Exit process with failure
  }
};

 export default connectDB;
