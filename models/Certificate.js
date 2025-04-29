const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: [{ type: String, required: true }],
  schedule: [  
    {
      type: { type: String, required: true }, 
      round:{ type: String },
      applicationStart: { type: Date },
      applicationEnd: { type: Date },
      examStart: { type: Date }, 
      examEnd: { type: Date }, 
      resultDate: { type: Date }
    }
  ],
  eligibility: { type: String, required: true },
  passingCriteria: { type: String, required: true },
  officialSite: { type: String },
  averageDifficulty: { type: Number, default: 0 },
  totalReviewCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Certificate", CertificateSchema);