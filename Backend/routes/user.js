const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const Meter = require('../models/Meters');
const Reading = require('../models/Reading');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'secret123');
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
});

router.get('/meter', authMiddleware, async (req, res) => {
  const meter = await Meter.findOne({ owner: req.userId });
  res.json(meter);
});


router.get('/usage', authMiddleware, async (req, res) => {
  try {
    const meter = await Meter.findOne({ owner: req.userId });
    if (!meter) return res.status(404).json({ error: 'Meter not found' });

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const readingsThisMonth = await Reading.find({
      meter: meter._id,
      timestamp: { $gte: startOfMonth },
    }).sort({ timestamp: 1 });

    const totalUnits = readingsThisMonth.reduce((sum, r) => sum + (r.kWh_Imp || 0), 0);
    const estimatedBill = totalUnits * 8; 

    const graphData = readingsThisMonth.map(r => ({
      date: new Date(r.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      usage: r.kWh_Imp || 0,
    }));

    const allReadings = await Reading.find({ meter: meter._id });

    const usageByMonth = {};
    for (const r of allReadings) {
      const month = new Date(r.timestamp).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
      usageByMonth[month] = (usageByMonth[month] || 0) + (r.kWh_Imp || 0);
    }

    const billingHistory = Object.entries(usageByMonth)
      .map(([month, units]) => ({
        month,
        units,
        amount: units * 8,
      }))
      .sort((a, b) => new Date('01 ' + b.month) - new Date('01 ' + a.month));

    res.json({
      units: totalUnits,
      estimatedBill,
      graphData,
      billingHistory,
    });
  } catch (err) {
    console.error("Error in /usage route:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
