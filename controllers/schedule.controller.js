const mongoose = require("mongoose");
const Schedule = require("../models/Schedule");

const scheduleController = {};

scheduleController.createSchedule = async (req, res) => {
  try {
    const { title, startDate, endDate, description, certificateId, color } = req.body;
    const userId = req.userId;

    if (!title || !startDate) {
      throw new Error("Title and startDate are required");
    }

    let certificateObjectId = null;
    if (certificateId) {
      if (!mongoose.Types.ObjectId.isValid(certificateId)) {
        throw new Error("Invalid certificateId format");
      }
      certificateObjectId = new mongoose.Types.ObjectId(certificateId);
    }

    const newSchedule = new Schedule({
      userId,
      title,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      description: description || "",
      certificateId: certificateObjectId,
      color: color || "#3498db"
    });

    await newSchedule.save();

    res.status(201).json({ status: "success", schedule: newSchedule });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

scheduleController.getUserSchedules = async (req, res) => {
  try {
    const userId = req.userId;
    const schedules = await Schedule.find({ userId }).sort({ startDate: 1 }).populate("certificateId");
    res.status(200).json({ status: "success", schedules });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

scheduleController.getSchedulesByDate = async (req, res) => {
  try {
    const userId = req.userId;
    const { date } = req.params;

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const schedules = await Schedule.find({
      userId,
      startDate: { $gte: startDate, $lte: endDate }
    }).sort({ startDate: 1 }).populate("certificateId");

    res.status(200).json({ status: "success", schedules });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

scheduleController.getScheduleById = async (req, res) => {
  try {
    const userId = req.userId;
    const { scheduleId } = req.params;
    const schedule = await Schedule.findOne({ _id: scheduleId, userId }).populate("certificateId");

    if (!schedule) throw new Error("Schedule not found");

    res.status(200).json({ status: "success", schedule });
  } catch (err) {
    res.status(404).json({ status: "fail", error: err.message });
  }
};

scheduleController.updateSchedule = async (req, res) => {
  try {
    const userId = req.userId;
    const { scheduleId } = req.params;
    const { certificateId, color } = req.body;

    let certificateObjectId = null;
    if (certificateId) {
      if (!mongoose.Types.ObjectId.isValid(certificateId)) {
        throw new Error("Invalid certificateId format");
      }
      certificateObjectId = new mongoose.Types.ObjectId(certificateId);
    }

    const allowedColors = ['#f94144', '#f3722c', '#f9c74f', '#90be6d', '#577590'];
    if (color && !allowedColors.includes(color)) {
      throw new Error("허용되지 않은 색상입니다.");
    }

    const updateData = {
      ...req.body,
      certificateId: certificateObjectId,
    };

    const updatedSchedule = await Schedule.findOneAndUpdate(
      { _id: scheduleId, userId },
      updateData,
      { new: true }
    );

    if (!updatedSchedule) throw new Error("Schedule not found");

    res.status(200).json({ status: "success", schedule: updatedSchedule });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

scheduleController.deleteSchedule = async (req, res) => {
  try {
    const userId = req.userId;
    const { scheduleId } = req.params;

    const deletedSchedule = await Schedule.findOneAndDelete({ _id: scheduleId, userId });
    if (!deletedSchedule) throw new Error("Schedule not found");

    res.status(200).json({ status: "success", message: "Schedule deleted" });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

module.exports = scheduleController;