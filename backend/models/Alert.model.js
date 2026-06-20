const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    riskLevel: {
      type: String,
      required: true,
      enum: ["LOW","MEDIUM","HIGH"]
    },
    affectedArea: {
      type: String,
      required: true,
      trim: true,
    },
    relatedIncidents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Incident', // assumes you have an Incident model
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);
