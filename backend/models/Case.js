const mongoose = require('mongoose');
 
const noteSchema = new mongoose.Schema({
  text:      { type: String, required: true },
  author:    { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
 
const caseSchema = new mongoose.Schema({
  travelerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Traveler',
    required: true,
  },
  assignedOfficerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Officer',
    default: null,
  },
  caseType: {
    type: String,
    enum: ['regular', 'refugee', 'asylum', 'flagged'],
    default: 'regular',
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'escalated'],
    default: 'open',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  notes: [noteSchema],
 
  // ── NGO Humanitarian Needs ──────────────────────────────────────────
  humanitarianNeeds: {
    shelter:        { type: Boolean, default: false },
    medical:        { type: Boolean, default: false },
    legalSupport:   { type: Boolean, default: false },
    childProtection:{ type: Boolean, default: false },
    food:           { type: Boolean, default: false },
    psychosocial:   { type: Boolean, default: false },
    familyTracing:  { type: Boolean, default: false },
    transportation: { type: Boolean, default: false },
  },
  needsNotes: { type: String, default: '' },
  needsUpdatedBy:   { type: String, default: null },
  needsUpdatedAt:   { type: Date,   default: null },
  // ────────────────────────────────────────────────────────────────────
 
}, { timestamps: true });
 
module.exports = mongoose.model('Case', caseSchema);
 