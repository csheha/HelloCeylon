import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection

// MongoDB connection
const mongoURL = process.env.MONGO_URL || "mongodb://mongodb:27017/chatbot";

mongoose
  .connect(mongoURL)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/chat", chatRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "Node.js server running",
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(5000, () =>
  console.log("🚀 Node backend running on http://localhost:5000")
);
