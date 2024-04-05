const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event', // Reference to the Event model
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  registeredAt:{
    type: Date,
    default: null
  }
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;