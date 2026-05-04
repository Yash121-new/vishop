# Vishop Trader LLP — Website

Full-stack website with Admin Panel built with HTML, CSS, and Node.js (Express).

## Project Structure

```
vishop/
├── server.js           ← Node.js Express backend
├── package.json
├── data/               ← Auto-created on first run
│   ├── queries.json    ← Contact form submissions
│   └── users.json      ← Registered users
└── public/
    ├── index.html      ← Main landing page
    ├── login.html      ← Login page
    ├── signup.html     ← Sign up page
    └── admin.html      ← Admin panel
```

## Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Start the server
```bash
node server.js
```

### 3. Open in browser
- **Website:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin.html

## Default Admin Credentials
```
Email:    admin@vishoptrader.com
Password: admin123
```
⚠️ Change these before deploying to production!

## Features

### Landing Page
- Hero section with company details (GSTIN, LLP ID)
- Services grid (6 services)
- Why Choose Us section
- Pricing plans (Basic / Standard / Premium)
- Contact form (saves queries to backend)

### Login / Signup
- Full form validation
- Password hashing (SHA-256 + salt)
- Duplicate email check

### Admin Panel
- **Dashboard** — Stats (total queries, new, replied, users)
- **Queries** — View all, filter by status, mark read/replied/delete
- **Users** — View registered users, remove users
- Auto-refresh every 30 seconds
- Search across queries and users

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/query | Submit contact query |
| POST | /api/signup | Register new user |
| POST | /api/login | Login |
| GET | /api/admin/queries | Get all queries (admin) |
| PATCH | /api/admin/queries/:id/status | Update query status (admin) |
| DELETE | /api/admin/queries/:id | Delete query (admin) |
| GET | /api/admin/users | Get all users (admin) |
| DELETE | /api/admin/users/:id | Delete user (admin) |

## Production Notes
- Replace JSON file storage with a proper database (MongoDB/PostgreSQL)
- Replace `x-admin: true` header check with JWT authentication
- Add rate limiting and HTTPS
- Change default admin password
