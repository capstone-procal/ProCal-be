const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: [{ type: String, required: true }], 
  examDates: [
    {
      type: { type: String, required: true },
      startDate: { type: Date },
      endDate: { type: Date }
    }
  ],
  eligibility: { type: String, required: true },
  passingCriteria: { type: String, required: true },
  officialSite: { type: String },
  averageDifficulty: { type: Number, default: 0 },
  totalReviewCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Certificate", CertificateSchema);