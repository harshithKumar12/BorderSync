const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bordersync';

// ── Inline schemas (so seed.js works standalone) ──────────────────────
const officerSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role:         { type: String, enum: ['admin', 'border_officer', 'ngo_coordinator'], default: 'border_officer' },
  badgeNumber:  { type: String, required: true, unique: true },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

const travelerSchema = new mongoose.Schema({
  name:               { type: String, required: true },
  nationality:        { type: String, required: true },
  documentType:       { type: String, enum: ['passport', 'visa', 'refugee_card'], required: true },
  documentNumber:     { type: String, required: true },
  dateOfBirth:        { type: Date, required: true },
  entryTime:          { type: Date, default: Date.now },
  exitTime:           { type: Date },
  status:             { type: String, enum: ['pending', 'approved', 'flagged', 'rejected'], default: 'pending' },
  scannedDocumentData:{ type: Object },
  assignedOfficerId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Officer' },
  notes:              { type: String },
}, { timestamps: true });

const caseSchema = new mongoose.Schema({
  travelerId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Traveler', required: true },
  caseType:           { type: String, enum: ['regular', 'refugee', 'asylum', 'flagged'], default: 'regular' },
  assignedOfficerId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Officer' },
  status:             { type: String, enum: ['open', 'in_progress', 'resolved', 'escalated'], default: 'open' },
  priority:           { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  notes:              [{ text: String, createdAt: { type: Date, default: Date.now }, author: String }],
}, { timestamps: true });

const Officer  = mongoose.model('Officer',  officerSchema);
const Traveler = mongoose.model('Traveler', travelerSchema);
const Case     = mongoose.model('Case',     caseSchema);

// ── Seed data ─────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Officer.deleteMany({});
  await Traveler.deleteMany({});
  await Case.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // Create officers
  const [adminHash, officerHash, ngoHash] = await Promise.all([
    bcrypt.hash('admin123', 10),
    bcrypt.hash('officer123', 10),
    bcrypt.hash('ngo123', 10),
  ]);

  const [admin, officer, ngo] = await Officer.insertMany([
    { name: 'Admin User',       email: 'admin@bordersync.io',   passwordHash: adminHash,   role: 'admin',           badgeNumber: 'ADM-001', isActive: true },
    { name: 'John Officer',     email: 'officer@bordersync.io', passwordHash: officerHash, role: 'border_officer',  badgeNumber: 'OFF-042', isActive: true },
    { name: 'Sara NGO',         email: 'ngo@bordersync.io',     passwordHash: ngoHash,     role: 'ngo_coordinator', badgeNumber: 'NGO-007', isActive: true },
  ]);
  console.log('👮 Created 3 officers');

  // Create travelers
  const travelers = await Traveler.insertMany([
    { name: 'Maria Santos',    nationality: 'Brazilian',   documentType: 'passport',     documentNumber: 'BR-1234567', dateOfBirth: new Date('1990-05-12'), status: 'approved',  assignedOfficerId: officer._id, entryTime: new Date() },
    { name: 'Ahmed Hassan',    nationality: 'Egyptian',    documentType: 'visa',         documentNumber: 'EG-9876543', dateOfBirth: new Date('1985-03-22'), status: 'pending',   assignedOfficerId: officer._id, entryTime: new Date() },
    { name: 'Li Wei',          nationality: 'Chinese',     documentType: 'passport',     documentNumber: 'CN-5551234', dateOfBirth: new Date('1995-11-08'), status: 'approved',  assignedOfficerId: admin._id,   entryTime: new Date() },
    { name: 'Fatima Al-Zahra', nationality: 'Moroccan',    documentType: 'refugee_card', documentNumber: 'RF-0001122', dateOfBirth: new Date('1988-07-30'), status: 'flagged',   assignedOfficerId: officer._id, entryTime: new Date(), notes: 'Requires further verification' },
    { name: 'Carlos Rivera',   nationality: 'Mexican',     documentType: 'passport',     documentNumber: 'MX-3334455', dateOfBirth: new Date('1992-01-14'), status: 'approved',  assignedOfficerId: admin._id,   entryTime: new Date() },
    { name: 'Priya Sharma',    nationality: 'Indian',      documentType: 'visa',         documentNumber: 'IN-7778899', dateOfBirth: new Date('1998-09-25'), status: 'pending',   assignedOfficerId: officer._id, entryTime: new Date() },
    { name: 'Ivan Petrov',     nationality: 'Russian',     documentType: 'passport',     documentNumber: 'RU-2223344', dateOfBirth: new Date('1980-12-03'), status: 'rejected',  assignedOfficerId: admin._id,   entryTime: new Date(), notes: 'Document expired' },
    { name: 'Amara Diallo',    nationality: 'Guinean',     documentType: 'refugee_card', documentNumber: 'RF-0005566', dateOfBirth: new Date('2000-04-17'), status: 'pending',   assignedOfficerId: officer._id, entryTime: new Date() },
    { name: 'Sophie Martin',   nationality: 'French',      documentType: 'passport',     documentNumber: 'FR-6667788', dateOfBirth: new Date('1993-06-21'), status: 'approved',  assignedOfficerId: admin._id,   entryTime: new Date() },
    { name: 'Omar Abdullah',   nationality: 'Syrian',      documentType: 'refugee_card', documentNumber: 'RF-0009900', dateOfBirth: new Date('1987-08-10'), status: 'flagged',   assignedOfficerId: officer._id, entryTime: new Date(), notes: 'Asylum claim under review' },
  ]);
  console.log('🧳 Created 10 travelers');

  // Create cases
  await Case.insertMany([
    {
      travelerId: travelers[3]._id, caseType: 'flagged',  assignedOfficerId: officer._id, status: 'open',        priority: 'high',
      notes: [{ text: 'Document authenticity check initiated', author: 'John Officer', createdAt: new Date() }],
    },
    {
      travelerId: travelers[7]._id, caseType: 'refugee',  assignedOfficerId: officer._id, status: 'in_progress', priority: 'high',
      notes: [{ text: 'UNHCR referral letter received, processing asylum claim', author: 'John Officer', createdAt: new Date() }],
    },
    {
      travelerId: travelers[9]._id, caseType: 'asylum',   assignedOfficerId: admin._id,   status: 'in_progress', priority: 'high',
      notes: [{ text: 'Interview scheduled for next week', author: 'Admin User', createdAt: new Date() }],
    },
    {
      travelerId: travelers[1]._id, caseType: 'regular',  assignedOfficerId: officer._id, status: 'open',        priority: 'low',
      notes: [{ text: 'Additional documents requested', author: 'John Officer', createdAt: new Date() }],
    },
    {
      travelerId: travelers[5]._id, caseType: 'regular',  assignedOfficerId: admin._id,   status: 'resolved',    priority: 'medium',
      notes: [{ text: 'All documents verified, case closed', author: 'Admin User', createdAt: new Date() }],
    },
  ]);
  console.log('📁 Created 5 cases');

  console.log('\n✅ Seed complete! Demo accounts:');
  console.log('   Admin:   admin@bordersync.io   / admin123');
  console.log('   Officer: officer@bordersync.io / officer123');
  console.log('   NGO:     ngo@bordersync.io     / ngo123\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});