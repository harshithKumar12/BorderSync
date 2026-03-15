function roleGuard(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { role } = req.user;
    if (allowedRoles.includes(role)) {
      return next();
    }

    return res.status(403).json({ success: false, message: 'Forbidden: insufficient role' });
  };
}

module.exports = { roleGuard };


