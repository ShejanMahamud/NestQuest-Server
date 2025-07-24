const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: true
  },
  property_id: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Wishlist', wishlistSchema); 