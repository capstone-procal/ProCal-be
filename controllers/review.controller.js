const mongoose = require("mongoose");
const Review = require("../models/Review");
const Certificate = require("../models/Certificate");

const updateCertificateDifficulty = async (certificateId, difficultyChange, isDelete = false) => {
  const certificate = await Certificate.findById(certificateId);
  
  if (!certificate) return;

  let { totalDifficulty, reviewCount } = certificate;

  if (isDelete) {
    reviewCount -= 1;
    totalDifficulty -= difficultyChange;
  } else {
    reviewCount += 1;
    totalDifficulty += difficultyChange;
  }

  const averageDifficulty = reviewCount > 0 ? totalDifficulty / reviewCount : 0;

  await Certificate.findByIdAndUpdate(certificateId, { 
    totalDifficulty, 
    reviewCount, 
    averageDifficulty 
  });
};

const reviewController = {};

reviewController.getReviewsByCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(certificateId)) {
      throw new Error("Invalid certificateId format");
    }

    const reviews = await Review.find({ certificateId, isDeleted: false }).populate("userId", "name");

    res.status(200).json({ status: "success", reviews });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

reviewController.getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new Error("Invalid reviewId format");
    }

    const review = await Review.findById(reviewId).populate("userId", "name");

    if (!review || review.isDeleted) throw new Error("Review not found");

    res.status(200).json({ status: "success", review });
  } catch (err) {
    res.status(404).json({ status: "fail", error: err.message });
  }
};

reviewController.createReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { certificateId, content, difficulty } = req.body;

    if (!certificateId || !content || difficulty === undefined) {
      throw new Error("CertificateId, content, and difficulty are required");
    }

    if (!mongoose.Types.ObjectId.isValid(certificateId)) {
      throw new Error("Invalid certificateId format");
    }

    const certificate = await Certificate.findById(certificateId);
    if (!certificate) throw new Error("Certificate not found");

    if (difficulty < 1 || difficulty > 5) {
      throw new Error("Difficulty must be between 1 and 5");
    }

    const newReview = new Review({ userId, certificateId, content, difficulty });
    await newReview.save();

    await updateCertificateDifficulty(certificateId, difficulty);

    res.status(201).json({ status: "success", review: newReview });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

reviewController.updateReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { reviewId } = req.params;
    const { content, difficulty } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new Error("Invalid reviewId format");
    }

    const existingReview = await Review.findById(reviewId);
    if (!existingReview || existingReview.userId.toString() !== userId) {
      throw new Error("Review not found or no permission");
    }

    const oldDifficulty = existingReview.difficulty;

    existingReview.content = content || existingReview.content;
    existingReview.difficulty = difficulty || oldDifficulty;
    await existingReview.save();

    if (difficulty !== undefined && difficulty !== oldDifficulty) {
      await updateCertificateDifficulty(existingReview.certificateId, difficulty - oldDifficulty);
    }

    res.status(200).json({ status: "success", review: existingReview });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

reviewController.deleteReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new Error("Invalid reviewId format");
    }

    const review = await Review.findOneAndUpdate(
      { _id: reviewId, userId },
      { isDeleted: true },
      { new: true }
    );

    if (!review) throw new Error("Review not found or no permission");

    await updateCertificateDifficulty(review.certificateId, -review.difficulty, true);

    res.status(200).json({ status: "success", message: "Review marked as deleted" });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

module.exports = reviewController;