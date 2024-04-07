const mongoose = require('mongoose');

const interestDetailsSchema = new mongoose.Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event', // Reference to the Event model
    required: true
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User', // Reference to the User model
    default: []
  }
});

const InterestDetails = mongoose.model('InterestDetails', interestDetailsSchema);

module.exports = InterestDetails;
