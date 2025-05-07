const mongoose = require("mongoose");
const Reminder = require("../models/Reminder");

const reminderController = {};

const ALLOWED_COLORS = ['#54b5e2', '#eeb5ec', '#fa7f12', '#f6e705', '#1aba25'];

reminderController.createReminder = async (req, res) => {
  try {
    const userId = req.userId;
    const { certificateId, color } = req.body;

    if (!certificateId) throw new Error("CertificateId is required");
    if (!mongoose.Types.ObjectId.isValid(certificateId)) {
      throw new Error("Invalid certificateId format");
    }

    const existing = await Reminder.findOne({ userId, certificateId });
    if (existing) throw new Error("Already added to reminders");

    const validColor = ALLOWED_COLORS.includes(color) ? color : undefined;

    const newReminder = new Reminder({
      userId,
      certificateId,
      ...(validColor && { color: validColor })
    });

    await newReminder.save();

    res.status(201).json({ status: "success", reminder: newReminder });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

reminderController.getUserReminders = async (req, res) => {
  try {
    const userId = req.userId;
    const reminders = await Reminder.find({ userId }).populate("certificateId");
    res.status(200).json({ status: "success", reminders });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

reminderController.updateReminder = async (req, res) => {
  try {
    const userId = req.userId;
    const { reminderId } = req.params;
    const { color } = req.body;

    if (!ALLOWED_COLORS.includes(color)) {
      return res.status(400).json({ status: "fail", error: "허용되지 않은 색상입니다." });
    }

    const updated = await Reminder.findOneAndUpdate(
      { _id: reminderId, userId },
      { color },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ status: "fail", error: "Reminder not found" });
    }

    res.status(200).json({ status: "success", reminder: updated });
  } catch (err) {
    res.status(500).json({ status: "fail", error: err.message });
  }
};

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