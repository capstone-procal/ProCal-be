const mongoose = require("mongoose");

const ReminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  certificateId: { type: mongoose.Schema.Types.ObjectId, ref: "Certificate", required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Reminder", ReminderSchema);