const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['user', 'admin'] },
  createdAt: { type: Date, default: Date.now },
  updated: { type: Boolean, default: false },
  gender: { type: String, enum: ['male', 'female'] }
});

const UserDetails = mongoose.model('UserDetails', userDetailsSchema);

module.exports = UserDetails;
