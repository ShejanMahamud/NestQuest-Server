const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review_title: {
    type: String,
    required: true
  },
  review_description: {
    type: String,
    required: true
  },
  review_rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  property_id: {
    type: String,
    required: true
  },
  user_email: {
    type: String,
    required: true
  },
  review_time: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema); 