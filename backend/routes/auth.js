const express = require('express');
const { login, register, me } = require('../controllers/authController');
const { verifyToken } = require('../middleware/verifyToken');
const { roleGuard } = require('../middleware/roleGuard');

const router = express.Router();

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/register (admin only)
router.post('/register', verifyToken, roleGuard(['admin']), register);

// GET /api/auth/me
router.get('/me', verifyToken, me);

module.exports = router;


