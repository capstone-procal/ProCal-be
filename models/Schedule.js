const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  certificateId: { type: mongoose.Schema.Types.ObjectId, ref: "Certificate", default: null },
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: false },
  description: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Schedule", ScheduleSchema);