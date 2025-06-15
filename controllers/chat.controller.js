const chatController = {};
const Message = require("../models/Message");
const ChatRoom = require("../models/ChatRoom");

chatController.sendMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { roomId, text } = req.body;

    if (!text || !roomId) throw new Error("error");

    const message = new Message({
      roomId,
      senderId: userId,
      text,
      isRead: false, 
    });

    await message.save();

    res.status(201).json({ status: "success", message });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

chatController.getMessages = async (req, res) => {
  try {
    const userId = req.userId;
    const { roomId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      throw new Error("Invalid roomId");
    }

    await Message.updateMany(
      {
        roomId,
        senderId: { $ne: userId },
        isRead: false,
      },
      { $set: { isRead: true } }
    );

    const messages = await Message.find({ roomId })
      .populate("senderId", "nickname")
      .sort({ createdAt: 1 });

    res.status(200).json({ status: "success", messages });
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

    const conversations = await Promise.all(
      rooms.map(async (room) => {
        const otherUser =
          String(room.userA._id) === userId ? room.userB : room.userA;

        const lastMessage = await Message.findOne({ roomId: room._id })
          .sort({ createdAt: -1 })
          .lean();

        let hasUnread = false;

        if (lastMessage && String(lastMessage.senderId) !== userId && !lastMessage.isRead) {
          hasUnread = true;
        }

        return {
          _id: room._id,
          marketTitle: room.marketId?.title || "",
          otherUser,
          lastMessage,
          hasUnread,
        };
      })
    );

    res.status(200).json({ status: "success", conversations });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

module.exports = chatController;
