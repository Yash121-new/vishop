const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: String,
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: String,
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    service: String,
    createdAt: { type: Date, default: Date.now }
  },
  { collection: 'users' }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
