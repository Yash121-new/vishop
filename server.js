require('dotenv').config();
const express = require('express');
const path = require('path');
const { connectDB } = require('./utils/db');
const { hashPassword } = require('./utils/auth');
const User = require('./models/User');
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Redirect non-www to www
app.use((req, res, next) => {
  if (req.headers.host && !req.headers.host.startsWith('www.')) {
    const newHost = 'www.' + req.headers.host;
    return res.redirect(301, `${req.protocol}://${newHost}${req.originalUrl}`);
  }
  next();
});

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vishoptrader.com';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

const pageRoutes = [
  '/',
  '/about',
  '/pricing',
  '/contact',
  '/privacy',
  '/terms',
  '/login',
  '/signup'
];

pageRoutes.forEach(route => {
  app.get(route, (req, res) => {
    const page = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
    res.sendFile(path.join(__dirname, 'public', page));
  });
});

app.get('/healthwealth', (req, res) => {
  res.status(200).send('OK');
  console.log('✅ Health check passed');  
});

app.get('*', (req, res) => {
  // ❌ important files ko skip karo
  if (
    req.path === '/robots.txt' ||
    req.path === '/sitemap.xml' ||
    req.path.startsWith('/api')
  ) {
    return res.status(404).end();
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

async function start() {
  try {
    await connectDB();

    const adminExists = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
    if (!adminExists) {
      const adminUser = new User({
        firstName: 'Admin',
        lastName: '',
        email: ADMIN_EMAIL,
        phone: '8209887552',
        password: hashPassword(ADMIN_PASS),
        role: 'admin',
        service: ''
      });
      await adminUser.save();
      console.log('✅ Admin user created');
    }
  } catch (error) {
    console.error('DB connection failed, but continuing with static serving:', error.message);
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 Vishop Trader LLP — Server running on http://localhost:${PORT}`);
    console.log(`   Admin Panel : http://localhost:${PORT}/admin.html`);
    console.log(`   Admin Login : ${ADMIN_EMAIL} / ${ADMIN_PASS}\n`);
  });
}

start();
