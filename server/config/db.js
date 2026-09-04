const mongoose = require("mongoose");

async function connectDB(nodeEnv) {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error("MONGO_URI is not set. Please configure your .env file.");
    process.exit(1);
  }

  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: nodeEnv === "production" ? 10 : 5,
    });
    console.log(`MongoDB connected (${nodeEnv} mode)`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
