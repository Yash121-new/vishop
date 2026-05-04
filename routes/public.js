const express = require('express');
const { readJSON, writeJSON } = require('../utils/file');
const { hashPassword, generateId } = require('../utils/auth');
const path = require('path');

const router = express.Router();

const QUERIES_FILE = path.join(__dirname, '../data/queries.json');
const USERS_FILE = path.join(__dirname, '../data/users.json');

router.post('/query', (req, res) => {
  const { name, phone, email, service, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({
      message: 'Name, email, and message are required.'
    });
  }

  const queries = readJSON(QUERIES_FILE);
  const query = {
    id: generateId(),
    name: name.trim(),
    phone: phone?.trim() || '',
    email: email.trim().toLowerCase(),
    service: service || '',
    message: message.trim(),
    status: 'new',
    createdAt: new Date().toISOString()
  };

  queries.push(query);
  writeJSON(QUERIES_FILE, queries);
  console.log(`[QUERY] New query from ${name} (${email})`);
  res.json({ success: true, message: 'Query submitted successfully.' });
});

router.post('/signup', (req, res) => {
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

  const users = readJSON(USERS_FILE);
  if (users.find((u) => u.email === email.toLowerCase())) {
    return res.status(409).json({
      message: 'An account with this email already exists.'
    });
  }

  const user = {
    id: generateId(),
    firstName: firstName.trim(),
    lastName: lastName?.trim() || '',
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || '',
    password: hashPassword(password),
    role: 'user',
    service: service || '',
    createdAt: new Date().toISOString()
  };

  users.push(user);
  writeJSON(USERS_FILE, users);
  console.log(`[SIGNUP] New user: ${firstName} (${email})`);
  res.json({ success: true, message: 'Account created successfully.' });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required.'
    });
  }

  const users = readJSON(USERS_FILE);
  let user = users.find(
    (u) => u.email === email.toLowerCase() && u.password === hashPassword(password)
  );

  if (!user) {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vishoptrader.com';
    const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASS) {
      user = {
        id: 'admin-001',
        firstName: 'Admin',
        lastName: '',
        email: ADMIN_EMAIL,
        phone: '8209887552',
        role: 'admin',
        service: '',
        createdAt: new Date().toISOString()
      };
    }
  }

  if (!user) {
    return res.status(401).json({
      message: 'Invalid email or password.'
    });
  }

  const { password: _, ...safeUser } = user;
  console.log(`[LOGIN] ${user.email} (${user.role})`);
  res.json({ success: true, user: safeUser });
});

module.exports = router;
