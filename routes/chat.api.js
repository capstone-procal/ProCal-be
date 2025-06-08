const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const authController = require("../controllers/auth.controller");

router.post(
  "/room",
  authController.authenticate,
  chatController.createOrGetRoom
);

router.get(
  "/messages/:roomId",
  authController.authenticate,
  chatController.getMessages
);

router.post(
  "/message",
  authController.authenticate,
  chatController.sendMessage
);

router.get(
  "/conversations",
  authController.authenticate,
  chatController.getConversations
);

router.delete(
  "/room/:roomId",
  authController.authenticate,
  chatController.deleteRoom
);

module.exports = router;