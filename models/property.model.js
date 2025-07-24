const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  property_title: {
    type: String,
    required: true,
    trim: true
  },
  property_description: {
    type: String,
    required: true
  },
  property_location: {
    type: String,
    required: true
  },
  property_price_min: {
    type: Number,
    required: true
  },
  property_price_max: {
    type: Number,
    required: true
  },
  property_status: {
    type: String,
    enum: ['Verified', 'Pending', 'Rejected'],
    default: 'Pending'
  },
  property_advertise: {
    type: Boolean,
    default: false
  },
  agent_email: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Property', propertySchema); 