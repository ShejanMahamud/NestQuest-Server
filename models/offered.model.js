const mongoose = require('mongoose');

const offeredSchema = new mongoose.Schema({
  property_id: {
    type: String,
    required: true
  },
  agent_email: {
    type: String,
    required: true
  },
  buyer_email: {
    type: String,
    required: true
  },
  offer_price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected', 'Bought'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Offered', offeredSchema); 