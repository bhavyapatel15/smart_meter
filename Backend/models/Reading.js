const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  meter: { type: mongoose.Schema.Types.ObjectId, ref: 'Meter', required: true },
  timestamp: { type: Date, default: Date.now },

  voltage: Number,
  current: Number,
  pf: Number, 
  kWh_Imp: Number, 
  kWh_Exp: Number, 
  kVAh_Imp: Number,
  kVArh_Lag: Number,
  kVArh_Lead: Number,
  blockDemand_kW: Number,
  neutralCurrent: Number
});
module.exports = mongoose.model('Reading', readingSchema);