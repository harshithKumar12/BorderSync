const mongoose = require('mongoose');

const OfficerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['border_officer', 'ngo_coordinator', 'admin'],
      required: true,
    },
    badgeNumber: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Officer', OfficerSchema);


