const mongoose = require("mongoose");

const ReminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  certificateId: { type: mongoose.Schema.Types.ObjectId, ref: "Certificate", required: true },
  color: { type: String, default: "#d0d0d0" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Reminder", ReminderSchema);