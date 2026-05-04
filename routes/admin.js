const express = require('express');
const Query = require('../models/Query');
const User = require('../models/User');

const router = express.Router();

function adminOnly(req, res, next) {
  if (req.headers['x-admin'] === 'true') return next();
  res.status(403).json({ message: 'Forbidden.' });
}

// ── ADMIN LOGIN ──
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vishoptrader.com';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

  if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASS) {
    return res.status(401).json({ message: 'Invalid admin credentials.' });
  }

  res.json({ success: true });
});

// ── GET ALL QUERIES ──
router.get('/queries', adminOnly, async (req, res) => {
  try {
    const queries = await Query.find({}).sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching queries.' });
  }
});

// ── UPDATE QUERY STATUS ──
router.patch('/queries/:id/status', adminOnly, async (req, res) => {
  try {
    const query = await Query.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!query) {
      return res.status(404).json({ message: 'Query not found.' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error updating query.' });
  }
});

// ── DELETE QUERY ──
router.delete('/queries/:id', adminOnly, async (req, res) => {
  try {
    await Query.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting query.' });
  }
});

// ── GET ALL USERS ──
router.get('/users', adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users.' });
  }
});

// ── DELETE USER ──
router.delete('/users/:id', adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user.' });
  }
});

module.exports = router;
