import "dotenv/config";
import mongoose from "mongoose";
import { createApp } from "./app.js";

const { PORT = 5000, MONGO_URI = "mongodb://127.0.0.1:27017/task-manager", CLIENT_ORIGIN } = process.env;

try {
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");
  createApp(CLIENT_ORIGIN).listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
} catch (err) {
  console.error("Could not connect to MongoDB:", err.message);
  process.exit(1);
}
