const express = require("express");
const router = express.Router();

const userApi = require("./user.api");
const authApi = require("./auth.api");

const certificateApi = require("./certificate.api");
const scheduleApi = require("./schedule.api");
const reminderApi = require("./reminder.api");

const postApi = require("./post.api");
const commentApi = require("./comment.api");
const reviewApi = require("./review.api");

const marketApi = require("./market.api"); 
const chatApi = require("./chat.api");  

router.use("/user", userApi);
router.use("/auth", authApi);

router.use("/schedule", scheduleApi);
router.use("/reminder", reminderApi);

router.use("/certificate", certificateApi);
router.use("/review", reviewApi);

router.use("/post", postApi);
router.use("/comment", commentApi);

router.use("/market", marketApi);
router.use("/chat", chatApi);  

module.exports = router;