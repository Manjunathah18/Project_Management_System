import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const options = {};
    if (process.env.MONGO_USER && process.env.MONGO_PASS) {
      options.auth = {
        username: process.env.MONGO_USER,
        password: process.env.MONGO_PASS,
      };
      options.authSource = "admin";
    }
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error", error);
    process.exit(1);
  }
};

export default connectDB;
