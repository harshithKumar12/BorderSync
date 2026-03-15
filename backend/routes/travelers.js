const express = require('express');
const {
  createTraveler,
  listTravelers,
  getTraveler,
  updateTraveler,
  deleteTraveler,
} = require('../controllers/travelerController');
const { verifyToken } = require('../middleware/verifyToken');
const { roleGuard } = require('../middleware/roleGuard');

const router = express.Router();

// All traveler routes are protected
router.use(verifyToken);

// POST /api/travelers → create new entry (border_officer, admin)
router.post('/', roleGuard(['border_officer', 'admin']), createTraveler);

// GET /api/travelers → list all with filters
router.get('/', roleGuard(['border_officer', 'ngo_coordinator', 'admin']), listTravelers);

// GET /api/travelers/:id → detail
router.get('/:id', roleGuard(['border_officer', 'ngo_coordinator', 'admin']), getTraveler);

// PATCH /api/travelers/:id → update status or notes (border_officer, admin)
router.patch('/:id', roleGuard(['border_officer', 'admin']), updateTraveler);

// DELETE /api/travelers/:id → admin only
router.delete('/:id', roleGuard(['admin']), deleteTraveler);

module.exports = router;


