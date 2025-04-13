const mongoose = require("mongoose");
const Reminder = require("../models/Reminder");

const reminderController = {};

// 찜 등록
reminderController.createReminder = async (req, res) => {
  try {
    const userId = req.userId; 
    const { certificateId } = req.body;

    if (!certificateId) {
      throw new Error("CertificateId is required");
    }

    if (!mongoose.Types.ObjectId.isValid(certificateId)) {
      throw new Error("Invalid certificateId format");
    }

    const existing = await Reminder.findOne({ userId, certificateId });
    if (existing) throw new Error("Already added to reminders");

    const newReminder = new Reminder({ userId, certificateId });
    await newReminder.save();

    res.status(201).json({ status: "success", reminder: newReminder });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

// 내 찜 목록 조회
reminderController.getUserReminders = async (req, res) => {
  try {
    const userId = req.userId; 
    const reminders = await Reminder.find({ userId }).populate("certificateId");

    res.status(200).json({ status: "success", reminders });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

// 찜 삭제 (하트 해제)
reminderController.deleteReminder = async (req, res) => {
  try {
    const userId = req.userId;
    const { certificateId } = req.params;

    const deletedReminder = await Reminder.findOneAndDelete({ certificateId, userId });
    if (!deletedReminder) throw new Error("Reminder not found");

    res.status(200).json({ status: "success", message: "Reminder deleted" });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

module.exports = reminderController;