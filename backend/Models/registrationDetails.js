const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  registration_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true // Automatically generate registration_id
  },
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event', // Reference to the Event model
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  }
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;