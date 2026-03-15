const Traveler = require('../models/Traveler');
const Case = require('../models/Case');

// GET /api/dashboard/stats
async function getStats(req, res, next) {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [totalToday, pending, flagged, approved, rejected, openCases, recentEntries] = await Promise.all([
      Traveler.countDocuments({ entryTime: { $gte: startOfToday } }),
      Traveler.countDocuments({ status: 'pending' }),
      Traveler.countDocuments({ status: 'flagged' }),
      Traveler.countDocuments({ status: 'approved' }),
      Traveler.countDocuments({ status: 'rejected' }),
      Case.countDocuments({ status: { $in: ['open', 'in_progress'] } }),
      // Show last 10 entries regardless of date so the table is never empty
      Traveler.find()
        .sort({ entryTime: -1 })
        .limit(10)
        .select('name nationality documentType status entryTime'),
    ]);

    res.json({
      totalToday,
      pending,
      flagged,
      approved,
      rejected,
      openCases,
      recentEntries,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats };