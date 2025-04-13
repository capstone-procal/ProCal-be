const mongoose = require("mongoose");
const Market = require("../models/Market");

const marketController = {};

// 마켓 아이템 등록
marketController.createItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, description, price, image, status } = req.body;

    if (!title || !description || !price) {
      throw new Error("title, description, price는 필수입니다.");
    }

    const newItem = new Market({
      userId,
      title,
      description,
      price,
      image,
      status
    });

    await newItem.save();
    res.status(201).json({ status: "success", item: newItem });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

// 전체 마켓 아이템 조회
marketController.getAllItems = async (req, res) => {
  try {
    const items = await Market.find({ isDeleted: false }).populate("userId", "name").sort({ createdAt: -1 });
    res.status(200).json({ status: "success", items });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

// 단일 마켓 아이템 상세
marketController.getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      throw new Error("Invalid itemId format");
    }

    const item = await Market.findById(itemId).populate("userId", "name");
    if (!item || item.isDeleted) throw new Error("Item not found");

    res.status(200).json({ status: "success", item });
  } catch (err) {
    res.status(404).json({ status: "fail", error: err.message });
  }
};

// 마켓 아이템 수정
marketController.updateItem = async (req, res) => {
  try {
    const userId = req.userId;
    const userLevel = req.userLevel;
    const { itemId } = req.params;
    const { title, description, price, image, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      throw new Error("Invalid itemId format");
    }

    const item = await Market.findById(itemId);
    if (!item || item.isDeleted) throw new Error("Item not found");

    const isOwner = String(item.userId) === userId;
    const isAdmin = userLevel === "admin";

    if (!isOwner && !isAdmin) throw new Error("No permission");

    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (price !== undefined) item.price = price;
    if (image !== undefined) item.image = image;
    if (status !== undefined) item.status = status;

    await item.save();
    res.status(200).json({ status: "success", item });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

// 마켓 아이템 삭제
marketController.deleteItem = async (req, res) => {
  try {
    const userId = req.userId;
    const userLevel = req.userLevel;
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      throw new Error("Invalid itemId format");
    }

    const item = await Market.findById(itemId);
    if (!item || item.isDeleted) throw new Error("Item not found");

    const isOwner = String(item.userId) === userId;
    const isAdmin = userLevel === "admin";

    if (!isOwner && !isAdmin) throw new Error("No permission");

    item.isDeleted = true;
    await item.save();

    res.status(200).json({ status: "success", message: "Item deleted" });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

module.exports = marketController;