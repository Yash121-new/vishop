const express = require('express');
const { readJSON, writeJSON } = require('../utils/file');
const path = require('path');

const router = express.Router();

const QUERIES_FILE = path.join(__dirname, '../data/queries.json');
const USERS_FILE = path.join(__dirname, '../data/users.json');

function adminOnly(req, res, next) {
  if (req.headers['x-admin'] === 'true') return next();
  res.status(403).json({ message: 'Forbidden.' });
}

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

router.get('/queries', adminOnly, (req, res) => {
  res.json(readJSON(QUERIES_FILE));
});

router.patch('/queries/:id/status', adminOnly, (req, res) => {
  const queries = readJSON(QUERIES_FILE);
  const idx = queries.findIndex((q) => q.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Query not found.' });
  }
  queries[idx].status = req.body.status;
  writeJSON(QUERIES_FILE, queries);
  res.json({ success: true });
});

router.delete('/queries/:id', adminOnly, (req, res) => {
  let queries = readJSON(QUERIES_FILE);
  queries = queries.filter((q) => q.id !== req.params.id);
  writeJSON(QUERIES_FILE, queries);
  res.json({ success: true });
});

router.get('/users', adminOnly, (req, res) => {
  const users = readJSON(USERS_FILE).map(({ password, ...u }) => u);
  res.json(users.filter((u) => u.role !== 'admin'));
});

router.delete('/users/:id', adminOnly, (req, res) => {
  let users = readJSON(USERS_FILE);
  users = users.filter((u) => u.id !== req.params.id);
  writeJSON(USERS_FILE, users);
  res.json({ success: true });
});

module.exports = router;
