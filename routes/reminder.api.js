const express = require("express");
const router = express.Router();
const reminderController = require("../controllers/reminder.controller");
const authController = require("../controllers/auth.controller");

router.post(
  "/",
  authController.authenticate,
  reminderController.createReminder
);
router.get(
  "/",
  authController.authenticate,
  reminderController.getUserReminders
);
router.delete(
  "/:certificateId",
  authController.authenticate,
  reminderController.deleteReminder
);

module.exports = router;
