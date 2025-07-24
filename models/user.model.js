const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['User', 'Admin', 'Agent'],
    default: 'User'
  },
  photo: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Fraud'],
    default: 'Active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema); 