// מודל מדידות טמפרטורה
const mongoose = require('mongoose')
const TemperatureMeasurementSchema = new mongoose.Schema({
  measurementId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  temperature: {
    type: Number,
    required: true,
    min: -20,
    max: 100
  },
  measurementTime: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'temperature_measurements'
});
module.exports = mongoose.model("Temperature", TemperatureMeasurementSchema)