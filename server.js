/* ════════════════════════════════════════════════════════ */
/* MAIN SERVER - CLEAN & MODULAR */
/* ════════════════════════════════════════════════════════ */

require('dotenv').config();
const express = require('express');
const path = require('path');
const { initializeDataDir, writeJSON } = require('./utils/file');
const { hashPassword, generateId } = require('./utils/auth');
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// ── INITIALIZE DATA ──
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vishoptrader.com';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
const adminUser = {
  id: 'admin-001',
  firstName: 'Admin',
  lastName: '',
  email: ADMIN_EMAIL,
  phone: '8209887552',
  password: hashPassword(ADMIN_PASS),
  role: 'admin',
  service: '',
  createdAt: new Date().toISOString()
};

initializeDataDir(DATA_DIR, [
  { path: path.join(DATA_DIR, 'queries.json'), defaultData: [] },
  { path: USERS_FILE, defaultData: [adminUser] }
]);

// ── MIDDLEWARE ──
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── ROUTES ──
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// ── FALLBACK SPA ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── START SERVER ──
app.listen(PORT, () => {
  console.log(`\n🚀 Vishop Trader LLP — Server running on http://localhost:${PORT}`);
  console.log(`   Admin Panel : http://localhost:${PORT}/admin.html`);
  console.log(`   Admin Login : admin@vishoptrader.com / admin123\n`);
});
