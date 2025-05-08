const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  certificateId: { type: mongoose.Schema.Types.ObjectId, ref: "Certificate", required: true },
  category: { type: String, enum: ['review','tip'], required: true },
  content: { type: String, required: true },
  difficulty: { type: Number, required: true, min: 1, max: 5 },
  adminComment: { type: String, default: "" },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Review", ReviewSchema);