const EventDetails = require('../Models/eventDetails');

// Controller function to handle adding a new event
const addEvent = async (req, res) => {
  try {
    // Extract event data from the request body
    const eventData = req.body;
    
    // Create a new event document
    const newEvent = new EventDetails(eventData);

    // Save the new event to the database
    await newEvent.save();

    // Respond with a success message
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    // If an error occurs, respond with an error message
    console.error('Error saving event details:', error);
    res.status(500).json({ message: 'Failed to save event details', error: error.message });
  }
};



// Controller function to fetch all events
const getAllEvents = async (req, res) => {
  try {
    const events = await EventDetails.find();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  addEvent,
  getAllEvents
};