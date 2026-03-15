const express = require('express');
const router  = express.Router();
const Officer = require('../models/Officer');
const { verifyToken } = require('../middleware/verifyToken');
const { roleGuard }   = require('../middleware/roleGuard');

// All admin routes require auth + admin role
router.use(verifyToken);
router.use(roleGuard(['admin']));

// GET /api/admin/officers — list all officers
router.get('/officers', async (req, res, next) => {
  try {
    const officers = await Officer.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 });
    return res.json(officers);
  } catch (err) { next(err); }
});

// PATCH /api/admin/officers/:id/toggle — activate / deactivate
router.patch('/officers/:id/toggle', async (req, res, next) => {
  try {
    const officer = await Officer.findById(req.params.id).select('-passwordHash');
    if (!officer) return res.status(404).json({ success: false, message: 'Officer not found' });
    officer.isActive = !officer.isActive;
    await officer.save();
    return res.json(officer);
  } catch (err) { next(err); }
});

module.exports = router;