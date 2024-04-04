const EventDetails = require('../Models/eventDetails');

// Controller function to handle adding a new event
const addEvent = async (req, res) => {
  try {
    // Extract event data from the request body
    const eventData = {
      ...req.body,
      createdAt: new Date(),
      editedAt: null,
      cancelledAt: null,
      status: 'upcoming'
    };
    
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

    // Iterate through the fetched events
    events.forEach(async (event) => {
      const currentTime = new Date()
    
      const startDate = new Date(event.startDate);
      const startTime = event.startTime.split(':'); // Split the time string HH:mm
      startDate.setHours(startTime[0]); // Set hours from startTime
      startDate.setMinutes(startTime[1]); // Set minutes from startTime

      const endDate = new Date(event.endDate);
      const endTime = event.endTime.split(':'); // Split the time string HH:mm
      endDate.setHours(endTime[0]); // Set hours from endTime
      endDate.setMinutes(endTime[1]); // Set minutes from endTime

     

      // const localCurrentTime = new Date(currentTime.getTime() - currentTime.getTimezoneOffset() * 60000);

      // Update status based on current time and event start/end times
      if(event.status!='cancelled'){
      if (currentTime < startDate) {
        event.status = 'upcoming';
      } else if (currentTime >= startDate && currentTime <= endDate) {
        event.status = 'ongoing';
      } else {
        event.status = 'completed';
      }}

      // Save the updated event to the database
      await event.save();
    });

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const eventDataToUpdate = req.body; // New event details from request body
    // Update the event details in the database
    const updatedEvent = await EventDetails.findByIdAndUpdate(eventId, eventDataToUpdate, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Respond with the updated event details
    res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
};

module.exports = {
  addEvent,
  getAllEvents,
  updateEvent
};
