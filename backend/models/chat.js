import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  user: { type: String, required: true },
  bot: { type: String, required: true },
  email: { type: String }, // Firebase user's email
  uid: { type: String }, // Firebase user's UID
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Chat", chatSchema);
