const Traveler = require('../models/Traveler');
const Case = require('../models/Case');

// POST /api/travelers
async function createTraveler(req, res, next) {
  try {
    const {
      name,
      nationality,
      documentType,
      documentNumber,
      dateOfBirth,
      notes,
      scannedDocumentData,
    } = req.body;

    if (!name || !nationality || !documentType || !documentNumber || !dateOfBirth) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // 🔴 CHECK DUPLICATE DOCUMENT NUMBER
    const existing = await Traveler.findOne({ documentNumber });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: '⚠ Duplicate passport detected',
        existingTraveler: {
          id: existing._id,
          name: existing.name,
          nationality: existing.nationality,
          entryTime: existing.entryTime,
        }
      });
    }

    // create traveler if no duplicate
    const traveler = await Traveler.create({
      name,
      nationality,
      documentType,
      documentNumber,
      dateOfBirth,
      notes: notes || '',
      scannedDocumentData: scannedDocumentData || null,
      assignedOfficerId: req.user?.id || null,
    });

    return res.status(201).json({ success: true, traveler });

  } catch (err) {
    next(err);
  }
}

// GET /api/travelers
async function listTravelers(req, res, next) {
  try {
    const { status, nationality, startDate, endDate, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (nationality) query.nationality = nationality;
    if (startDate || endDate) {
      query.entryTime = {};
      if (startDate) query.entryTime.$gte = new Date(startDate);
      if (endDate) query.entryTime.$lte = new Date(endDate);
    }

    const pageNum = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;

    const [items, total] = await Promise.all([
      Traveler.find(query)
        .sort({ entryTime: -1 })
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize),
      Traveler.countDocuments(query),
    ]);

    return res.json({
      success: true,
      data: items,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/travelers/:id
async function getTraveler(req, res, next) {
  try {
    const traveler = await Traveler.findById(req.params.id);
    if (!traveler) {
      return res.status(404).json({ success: false, message: 'Traveler not found' });
    }
    const travelCase = await Case.findOne({ travelerId: traveler._id }).sort({ createdAt: -1 });

    return res.json({ success: true, traveler, case: travelCase || null });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/travelers/:id
async function updateTraveler(req, res, next) {
  try {
    const { status, notes, exitTime } = req.body;
    const update = {};
    if (status) update.status = status;
    if (typeof notes === 'string') update.notes = notes;
    if (exitTime) update.exitTime = new Date(exitTime);

    const traveler = await Traveler.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    if (!traveler) {
      return res.status(404).json({ success: false, message: 'Traveler not found' });
    }

    return res.json({ success: true, traveler });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/travelers/:id
async function deleteTraveler(req, res, next) {
  try {
    const traveler = await Traveler.findByIdAndDelete(req.params.id);
    if (!traveler) {
      return res.status(404).json({ success: false, message: 'Traveler not found' });
    }
    await Case.deleteMany({ travelerId: traveler._id });
    return res.json({ success: true, message: 'Traveler and related cases deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createTraveler,
  listTravelers,
  getTraveler,
  updateTraveler,
  deleteTraveler,
};


