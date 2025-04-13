const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
  userA: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userB: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  marketId: { type: mongoose.Schema.Types.ObjectId, ref: "Market", required: true }
}, { timestamps: true });

module.exports = mongoose.model("ChatRoom", ChatRoomSchema);