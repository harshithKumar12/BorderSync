const express = require('express');
const { listCases, getCase, createCase, updateCase, updateNeeds } = require('../controllers/caseController');
const { verifyToken } = require('../middleware/verifyToken');
const { roleGuard }   = require('../middleware/roleGuard');

const router = express.Router();
router.use(verifyToken);

// All roles can list/view
router.get('/',    roleGuard(['border_officer', 'ngo_coordinator', 'admin']), listCases);
router.get('/:id', roleGuard(['border_officer', 'ngo_coordinator', 'admin']), getCase);

// Officers + admin create/update
router.post('/',    roleGuard(['border_officer', 'admin']), createCase);
router.patch('/:id', roleGuard(['border_officer', 'ngo_coordinator', 'admin']), updateCase);

// NGO + admin update humanitarian needs
router.patch('/:id/needs', roleGuard(['ngo_coordinator', 'admin']), updateNeeds);

module.exports = router;