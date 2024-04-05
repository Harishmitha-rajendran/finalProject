// Import mongoose
const mongoose = require('mongoose');

// Define interestDetails schema
const interestDetailsSchema = new mongoose.Schema({
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likedAt: {
        type: Date
    }
});

// Create interestDetails model
const InterestDetails = mongoose.model('InterestDetails', interestDetailsSchema);

// Export interestDetails model
module.exports = InterestDetails;
