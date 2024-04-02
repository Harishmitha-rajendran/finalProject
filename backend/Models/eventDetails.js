const mongoose = require('mongoose');

const eventDetailsSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true
  },
  description: String,
  startDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  location: String,
  trainer: String,
  prerequisites: String
});

const EventDetails = mongoose.model('EventDetails', eventDetailsSchema);

module.exports = EventDetails;
