// backend/models/chat.js
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  user: { type: String, required: true },
  bot: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Chat", chatSchema);
