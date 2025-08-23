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
mongoose
  .connect("mongodb://localhost:27017/chatbot", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/chat", chatRoutes);

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
