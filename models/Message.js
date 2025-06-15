const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom", required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  isRead: { type: Boolean, default: false },
}, { timestamps: { createdAt: true, updatedAt: false } }); 

module.exports = mongoose.model("Message", MessageSchema);