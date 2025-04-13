const mongoose = require("mongoose");
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");

const chatController = {};

// 1. 채팅방 생성 or 기존 채팅방 반환
chatController.createOrGetRoom = async (req, res) => {
  try {
    const userId = req.userId;
    const { opponentId, marketId } = req.body;

    if (!opponentId || !marketId) throw new Error("상대방과 마켓 ID는 필수입니다.");

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

// 2. 특정 채팅방의 메시지 목록 조회
chatController.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      throw new Error("Invalid roomId");
    }

    const messages = await Message.find({ roomId }).populate("senderId", "name").sort({ createdAt: 1 });
    res.status(200).json({ status: "success", messages });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

// 3. 메시지 보내기
chatController.sendMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { roomId, text } = req.body;

    if (!text || !roomId) throw new Error("roomId와 text는 필수입니다.");

    const message = new Message({ roomId, senderId: userId, text });
    await message.save();

    res.status(201).json({ status: "success", message });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

module.exports = chatController;