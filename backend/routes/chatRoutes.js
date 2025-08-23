import express from "express";
import axios from "axios";
import Chat from "../models/chat.js";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected chat route
router.post("/", verifyFirebaseToken, async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.json({ answer: "Please type a message." });
  }

  try {
    // Send to Python service
    const response = await axios.post("http://localhost:8000/chat", {
      message: userMessage,
    });

    const botReply = response.data.answer;
    if (!botReply) {
      return res.status(500).json({ answer: "No response from chatbot service." });
    }

    // Save chat with user info
    try {
      const chat = new Chat({
        user: userMessage,
        bot: botReply,
        email: req.user.email, // track per user
        uid: req.user.uid,
      });
      await chat.save();
    } catch (dbError) {
      console.error("MongoDB save error:", dbError);
    }

    res.json({ answer: botReply });
  } catch (err) {
    res.status(500).json({
      answer: `Service error: ${
        err.response?.data?.detail || err.message || "Chatbot error"
      }`,
    });
  }
});

export default router;