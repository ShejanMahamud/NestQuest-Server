const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter_email: {
    type: String,
    required: true
  },
  reported_email: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', reportSchema); 