const jwt = require('jsonwebtoken');
const Officer = require('../models/Officer');

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');

    const officer = await Officer.findById(decoded.id);
    if (!officer || !officer.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid token user' });
    }

    req.user = {
      id: officer._id,
      role: officer.role,
      name: officer.name,
      email: officer.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

module.exports = { verifyToken };


