const express = require('express');
const { hashPassword } = require('../utils/auth');
const User = require('../models/User');
const Query = require('../models/Query');

const router = express.Router();

// ── CONTACT QUERY ──
router.post('/query', async (req, res) => {
  try {
    const { name, phone, email, service, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({
        message: 'Name, email, and message are required.'
      });
    }

    const query = new Query({
      name: name.trim(),
      phone: phone?.trim() || '',
      email: email.trim().toLowerCase(),
      service: service || '',
      message: message.trim(),
      status: 'new'
    });

    await query.save();
    console.log(`[QUERY] New query from ${name} (${email})`);
    res.json({ success: true, message: 'Query submitted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting query.' });
  }
});

// ── SIGNUP ──
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, service } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({
        message: 'First name, email, and password are required.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists.'
      });
    }

    const user = new User({
      firstName: firstName.trim(),
      lastName: lastName?.trim() || '',
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      password: hashPassword(password),
      role: 'user',
      service: service || ''
    });

    await user.save();
    console.log(`[SIGNUP] New user: ${firstName} (${email})`);
    res.json({ success: true, message: 'Account created successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating account.' });
  }
});

// ── LOGIN ──
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.'
      });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vishoptrader.com';
      const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
      if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASS) {
        user = await User.findOne({ email: ADMIN_EMAIL.toLowerCase(), role: 'admin' });
        if (!user) {
          return res.status(401).json({
            message: 'Invalid email or password.'
          });
        }
      }
    }

    if (!user || user.password !== hashPassword(password)) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    const { password: _, ...safeUser } = user.toObject();
    console.log(`[LOGIN] ${user.email} (${user.role})`);
    res.json({ success: true, user: safeUser });
  } catch (error) {
    res.status(500).json({ message: 'Error during login.' });
  }
});

module.exports = router;
