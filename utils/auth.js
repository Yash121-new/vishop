/* ════════════════════════════════════════════════════════ */
/* AUTH & CRYPTO UTILITIES */
/* ════════════════════════════════════════════════════════ */

const crypto = require('crypto');

const SALT = 'vishop_salt_2025';

/**
 * Hash password with salt
 */
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + SALT).digest('hex');
}

/**
 * Generate unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

module.exports = {
  hashPassword,
  generateId
};
