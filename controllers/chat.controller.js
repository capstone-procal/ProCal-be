const mongoose = require("mongoose");
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");

const chatController = {};

chatController.createOrGetRoom = async (req, res) => {
  try {
    const userId = req.userId;
    const { opponentId, marketId } = req.body;

    if (!opponentId || !marketId) throw new Error("error");

    let room = await ChatRoom.findOne({
      $or: [
        { userA: userId, userB: opponentId, marketId },
        { userA: opponentId, userB: userId, marketId }
      ]
    });

    if (!room) {
      room = new ChatRoom({ userA: userId, userB: opponentId, marketId });
      await room.save();
    }

    res.status(200).json({ status: "success", room });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

chatController.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      throw new Error("Invalid roomId");
    }

    const messages = await Message.find({ roomId })
      .populate("senderId", "nickname")
      .sort({ createdAt: 1 });

    res.status(200).json({ status: "success", messages });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

chatController.sendMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { roomId, text } = req.body;

    if (!text || !roomId) throw new Error("error");

    const message = new Message({ roomId, senderId: userId, text });
    await message.save();

    res.status(201).json({ status: "success", message });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

chatController.getConversations = async (req, res) => {
  try {
    const userId = req.userId;

    const rooms = await ChatRoom.find({
      $or: [{ userA: userId }, { userB: userId }],
    })
      .populate("userA", "nickname")
      .populate("userB", "nickname")
      .populate("marketId", "title")
      .sort({ updatedAt: -1 });

    const conversations = rooms.map((room) => {
      const otherUser =
        String(room.userA._id) === userId ? room.userB : room.userA;
      return {
        _id: room._id,
        marketTitle: room.marketId?.title || "",
        otherUser,
      };
    });

    res.status(200).json({ status: "success", conversations });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

chatController.deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    await Message.deleteMany({ roomId });
    await ChatRoom.findByIdAndDelete(roomId);

    res.status(200).json({ status: "success", message: "error" });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

module.exports = chatController;