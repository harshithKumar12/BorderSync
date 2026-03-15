const mongoose = require('mongoose');

const TravelerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nationality: { type: String, required: true },
    documentType: {
      type: String,
      enum: ['passport', 'visa', 'refugee_card'],
      required: true,
    },
    documentNumber: { type: String, required: true,unique :true},
    dateOfBirth: { type: Date, required: true },
    entryTime: { type: Date, default: Date.now },
    exitTime: { type: Date },
    status: {
      type: String,
      enum: ['pending', 'approved', 'flagged', 'rejected'],
      default: 'pending',
    },
    scannedDocumentData: { type: Object },
    assignedOfficerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Officer' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Traveler', TravelerSchema);


