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
  prerequisites: String,
  capacity:Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  editedAt: {
    type: Date,
    default: null
  },
  cancelledAt: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['completed', 'ongoing', 'upcoming', 'cancelled'],
    default: 'upcoming'
  }
});

const EventDetails = mongoose.model('EventDetails', eventDetailsSchema);

module.exports = EventDetails;
