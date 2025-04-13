const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/schedule.controller");
const authController = require("../controllers/auth.controller");

router.post(
  "/",
  authController.authenticate,
  scheduleController.createSchedule
);
router.get(
  "/",
  authController.authenticate,
  scheduleController.getUserSchedules
);
router.get(
  "/:date",
  authController.authenticate,
  scheduleController.getSchedulesByDate
);
router.get(
  "/detail/:scheduleId",
  authController.authenticate,
  scheduleController.getScheduleById
);
router.put(
  "/:scheduleId",
  authController.authenticate,
  scheduleController.updateSchedule
);
router.delete(
  "/:scheduleId",
  authController.authenticate,
  scheduleController.deleteSchedule
);

module.exports = router;
