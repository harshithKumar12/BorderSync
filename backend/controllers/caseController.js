const Case     = require('../models/Case');
const Traveler = require('../models/Traveler');

// GET /api/cases
async function listCases(req, res, next) {
  try {
    const { status, caseType, type, priority, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status)           query.status   = status;
    if (caseType || type) query.caseType = caseType || type;
    if (priority)         query.priority = priority;
    const pageNum  = parseInt(page,  10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const [items, total] = await Promise.all([
      Case.find(query)
        .populate('travelerId',        'name nationality documentType documentNumber status')
        .populate('assignedOfficerId', 'name badgeNumber email')
        .sort({ updatedAt: -1 })
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize),
      Case.countDocuments(query),
    ]);
    return res.json({
      success: true, cases: items, data: items, total, page: pageNum,
      totalPages: Math.ceil(total / pageSize),
      pagination: { total, page: pageNum, limit: pageSize, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (err) { next(err); }
}

// GET /api/cases/:id
async function getCase(req, res, next) {
  try {
    const borderCase = await Case.findById(req.params.id)
      .populate('travelerId',        'name nationality documentType documentNumber dateOfBirth status notes entryTime')
      .populate('assignedOfficerId', 'name badgeNumber email role');
    if (!borderCase) return res.status(404).json({ success: false, message: 'Case not found' });
    return res.json(borderCase);
  } catch (err) { next(err); }
}

// POST /api/cases
async function createCase(req, res, next) {
  try {
    const { travelerId, caseType, priority } = req.body;
    if (!travelerId) return res.status(400).json({ success: false, message: 'travelerId is required' });
    const newCase = await Case.create({
      travelerId, caseType: caseType || 'regular', priority: priority || 'medium',
      assignedOfficerId: req.user?.id || null,
    });
    return res.status(201).json({ success: true, case: newCase });
  } catch (err) { next(err); }
}

// PATCH /api/cases/:id
async function updateCase(req, res, next) {
  try {
    const { status, priority, note } = req.body;
    const borderCase = await Case.findById(req.params.id);
    if (!borderCase) return res.status(404).json({ success: false, message: 'Case not found' });
    if (status)   borderCase.status   = status;
    if (priority) borderCase.priority = priority;
    if (note && note.trim()) {
      borderCase.notes.push({ text: note.trim(), author: req.user?.name || 'Officer' });
    }
    await borderCase.save();
    return res.json({ success: true, case: borderCase });
  } catch (err) { next(err); }
}

// PATCH /api/cases/:id/needs  ← NGO humanitarian needs
async function updateNeeds(req, res, next) {
  try {
    const { humanitarianNeeds, needsNotes } = req.body;
    const borderCase = await Case.findById(req.params.id);
    if (!borderCase) return res.status(404).json({ success: false, message: 'Case not found' });
    if (humanitarianNeeds && typeof humanitarianNeeds === 'object') {
      Object.keys(humanitarianNeeds).forEach(key => {
        if (borderCase.humanitarianNeeds[key] !== undefined) {
          borderCase.humanitarianNeeds[key] = Boolean(humanitarianNeeds[key]);
        }
      });
    }
    if (typeof needsNotes === 'string') borderCase.needsNotes = needsNotes;
    borderCase.needsUpdatedBy = req.user?.name || 'NGO';
    borderCase.needsUpdatedAt = new Date();
    borderCase.notes.push({
      text:   'Humanitarian needs assessment updated by ' + (req.user?.name || 'NGO Coordinator'),
      author: req.user?.name || 'NGO Coordinator',
    });
    await borderCase.save();
    return res.json({ success: true, case: borderCase });
  } catch (err) { next(err); }
}

module.exports = { listCases, getCase, createCase, updateCase, updateNeeds };