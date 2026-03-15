const express = require('express');
const { getStats } = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/verifyToken');
const { roleGuard } = require('../middleware/roleGuard');

const router = express.Router();

// All dashboard routes are protected
router.use(verifyToken);

// GET /api/dashboard/stats
// All roles can view stats, but NGO coordinators will use only relevant parts on frontend
router.get('/stats', roleGuard(['border_officer', 'ngo_coordinator', 'admin']), getStats);

module.exports = router;


