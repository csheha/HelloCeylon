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
// mongoose
//   .connect("mongodb://localhost:27017/chatbot", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("MongoDB connected successfully!");
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//   });

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

    // // Save chat to MongoDB
    // const chat = new Chat({
    //   user: userMessage,
    //   bot: botReply,
    // });

    // await chat.save(); // make sure to await

    // Send reply back to frontend
    res.botReply;
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ answer: "Something went wrong with the chatbot." });
  }
});

// App listener
app.listen(5000, () =>
  console.log("Node backend is running on http://localhost:5000")
);
