const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Officer = require('../models/Officer');

function generateToken(officer) {
  const payload = {
    id: officer._id,
    role: officer.role,
    name: officer.name,
    email: officer.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', {
    expiresIn: '8h',
  });
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const officer = await Officer.findOne({ email: email.toLowerCase() });
    if (!officer) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!officer.isActive) {
      return res.status(403).json({ success: false, message: 'Account is inactive' });
    }

    const isMatch = await bcrypt.compare(password, officer.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(officer);

    return res.json({
      success: true,
      token,
      user: {
        id: officer._id,
        name: officer.name,
        email: officer.email,
        role: officer.role,
        badgeNumber: officer.badgeNumber,
      },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/register (admin only)
async function register(req, res, next) {
  try {
    const { name, email, password, role, badgeNumber } = req.body;

    if (!name || !email || !password || !role || !badgeNumber) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existing = await Officer.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }

    const hash = await bcrypt.hash(password, 10);

    const officer = await Officer.create({
      name,
      email: email.toLowerCase(),
      passwordHash: hash,
      role,
      badgeNumber,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      officer: {
        id: officer._id,
        name: officer.name,
        email: officer.email,
        role: officer.role,
        badgeNumber: officer.badgeNumber,
        isActive: officer.isActive,
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
async function me(req, res) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  return res.json({ success: true, user: req.user });
}

module.exports = {
  login,
  register,
  me,
};


