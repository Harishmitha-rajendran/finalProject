// Import the InterestDetails model
const InterestDetails = require('../Models/interestDetails');

// Controller function to create interest details
exports.createInterestDetails = async (req, res) => {
    try {
        // Extract event_id, user_id from the request body
        const { event_id, user_id } = req.body;

        // Create a new InterestDetails document
        const interestDetails = new InterestDetails({
            event_id,
            user_id,
            likedAt: Date.now() // Set likedAt to current date and time
        });

        // Save the interestDetails document to the database
        await interestDetails.save();

        // Respond with success message
        res.status(201).json({ success: true, message: 'Interest details created successfully', interestDetails });
    } catch (error) {
        // Handle errors
        console.error('Error creating interest details:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
