import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of default 30s
      retryWrites: true,
    });
    console.log(`Database connected ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit(1); // exit with failure
  }
};
