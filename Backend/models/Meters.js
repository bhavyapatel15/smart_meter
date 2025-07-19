const mongoose = require('mongoose');

const meterSchema = new mongoose.Schema({
  meterNumber: {
    type: String,
    required: true,
    unique: true
  },

  type: {
    type: String,
    enum: ['electricity', 'water', 'gas'],
    default: 'electricity'
  },

  location: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String }
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  installedAt: {
    type: Date,
    default: Date.now
  },
  status: { type: String, enum: ['Active', 'Inactive', 'Faulty'], default: 'Active' }

});

module.exports = mongoose.model('Meter', meterSchema);