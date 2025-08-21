import express from "express";
import mongoose from "mongoose";
import axios from "axios";
import Chat from "./models/chat.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/chatbot", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Middleware to handle CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Proxy to Python service
app.post("/api/chat", async (req, res) => {
  console.log("Received request body:", req.body);
  const userMessage = req.body.message;

  if (!userMessage) {
    console.log("No message provided");
    return res.json({ answer: "Please type a message." });
  }

  try {
    console.log("Sending to Python service:", { message: userMessage });

    // Send to Python service
    const response = await axios.post("http://localhost:8000/chat", {
      message: userMessage,
    });

    console.log("Python service response status:", response.status);
    console.log("Python service response data:", response.data);

    const botReply = response.data.answer;
    console.log("Extracted bot reply:", botReply);

    if (!botReply) {
      console.error("No answer in Python response:", response.data);
      return res
        .status(500)
        .json({ answer: "No response from chatbot service." });
    }

    // Save chat to MongoDB
    try {
      const chat = new Chat({
        user: userMessage,
        bot: botReply,
      });
      await chat.save();
      console.log("Chat saved to MongoDB");
    } catch (dbError) {
      console.error("MongoDB save error:", dbError);
      // Continue even if DB save fails
    }

    // Send reply back to frontend
    console.log("Sending to frontend:", { answer: botReply });
    res.json({ answer: botReply });
  } catch (err) {
    console.error("Error details:");
    console.error("Error message:", err.message);
    console.error("Error response:", err.response?.data);
    console.error("Error status:", err.response?.status);
    console.error("Full error:", err);

    res.status(500).json({
      answer: `Service error: ${
        err.response?.data?.detail ||
        err.message ||
        "Something went wrong with the chatbot."
      }`,
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "Node.js server running",
    timestamp: new Date().toISOString(),
  });
});

// App listener
app.listen(5000, () =>
  console.log("Node backend is running on http://localhost:5000")
);
