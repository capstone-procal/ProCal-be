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
  "/room/:roomId",
  authController.authenticate,
  chatController.getMessages
);
router.post(
  "/message",
  authController.authenticate,
  chatController.sendMessage
);

module.exports = router;
