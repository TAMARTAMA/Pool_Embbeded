// מודל כניסות לבריכה
const mongoose = require('mongoose')
const EntryPoolSchema = new mongoose.Schema({
    entryId: {
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
    entryTime: {
      type: Date,
      required: true,
      default: Date.now
    },
    waterTemperature: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  }, {
    timestamps: true,
    collection: 'pool_entries'
  });
  module.exports = mongoose.model("Entry", EntryPoolSchema)