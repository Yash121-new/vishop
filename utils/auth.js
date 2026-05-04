const crypto = require('crypto');
const SALT = 'vishop_salt_2025';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + SALT).digest('hex');
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

module.exports = {
  hashPassword,
  generateId
};
