const mongoose = require('mongoose');

const querySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: String,
    email: { type: String, required: true, lowercase: true },
    service: String,
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: 'queries' }
);

const Query = mongoose.model('Query', querySchema);

module.exports = Query;
