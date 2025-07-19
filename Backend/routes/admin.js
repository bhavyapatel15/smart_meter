const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/Users');
const Admin = require('../models/Admin');
const Meter = require('../models/Meters');
const Reading = require('../models/Reading');

const SECRET_KEY = process.env.SECRET_KEY;

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded.isAdmin) return res.status(403).json({ message: 'Only admin allowed' });
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};



router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ message: 'Admin does not exist' });
  const isMatch =  await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: admin._id, isAdmin: true }, process.env.SECRET_KEY);
  res.json({ token });
});


router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/meters', verifyAdmin, async (req, res) => {
  try {
    const metersWithLatestReading = await Meter.aggregate([
      {
        $lookup: {
          from: 'readings',
          let: { meterId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$meter', '$$meterId'] } } },
            { $sort: { timestamp: -1 } },
            { $limit: 1 }
          ],
          as: 'latestReading'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'ownerData'
        }
      },
      {
        $addFields: {
          owner: { $arrayElemAt: ['$ownerData', 0] },
          latestReading: { $arrayElemAt: ['$latestReading', 0] }
        }
      },
      {
        $project: {
          meterNumber: 1,
          type: 1,
          location: 1,
          status: 1,
          latestReading: 1,
          owner: {
            _id: 1,
            name: 1,
            email: 1
          }
        }
      }
    ]);

    res.json(metersWithLatestReading);
  } catch (err) {
    console.error('Error fetching meters with latest reading:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/total-consumption', verifyAdmin, async (req, res) => {
  try {
    const readings = await Reading.find();
    const total = readings.reduce((sum, r) => sum + r.value, 0);
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/users/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Status updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users/:id/meters', verifyAdmin, async (req, res) => {
  try {
    const meters = await Meter.find({ owner: req.params.id });
    res.json(meters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users/:id/readings', verifyAdmin, async (req, res) => {
  try {
    const meters = await Meter.find({ owner: req.params.id }).select('_id');
    const meterIds = meters.map(m => m._id);
    const readings = await Reading.find({ meter: { $in: meterIds } });
    res.json(readings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const groupByTime = (readings, unit) => {
  const map = new Map();
  readings.forEach(reading => {
    const date = new Date(reading.timestamp);
    let key;
    if (unit === 'daily') key = date.toISOString().split('T')[0];
    else if (unit === 'weekly') key = `${date.getFullYear()}-W${Math.ceil((date.getDate() + 6 - date.getDay()) / 7)}`;
    else if (unit === 'monthly') key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const kWh = reading.kWh_Imp || 0;
    map.set(key, (map.get(key) || 0) + kWh);
  });

  return Array.from(map.entries()).map(([period, value]) => ({ period, value }));
};

router.get('/users/:id/consumption', verifyAdmin, async (req, res) => {
  try {
    const meters = await Meter.find({ owner: req.params.id }).select('_id');
    const meterIds = meters.map(m => m._id);
    const readings = await Reading.find({ meter: { $in: meterIds } });

    const total = readings.reduce((sum, r) => sum + (r.kWh_Imp || 0), 0);
    const daily = groupByTime(readings, 'daily');
    const weekly = groupByTime(readings, 'weekly');
    const monthly = groupByTime(readings, 'monthly');

    res.json({ total, daily, weekly, monthly });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/change-password', verifyAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect current password' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/admin_info', verifyAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
