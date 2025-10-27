const mongoose = require('mongoose');

const EmergencyAlertSchema = new mongoose.Schema({
  alertId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  alertType: {
    type: String,
    required: true,
    enum: ['LOW_PULSE', 'HIGH_PULSE', 'LOW_OXYGEN', 'SIGNAL_LOST'],
    trim: true
  },
  sensorValue: {
    type: Number,
    required: true
  },
  alertTime: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'emergency_alerts'
});

module.exports = mongoose.model("Emergency", EmergencyAlertSchema);
