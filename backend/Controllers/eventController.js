const EventDetails = require('../Models/eventDetails');
const UserDetails=require('../Models/userDetails');
const RegistrationDetails=require('../Models/registrationDetails');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '20bcs004@gmail.com', 
    pass: 'tiin okwz ndcs iuog'   
  }
});

// Controller function to handle adding a new event
const addEvent = async (req, res) => {
  try {
    // Extract event data from the request body
    const eventData = {
      ...req.body,
      createdAt: new Date(),
      editedAt: null,
      cancelledAt: null,
      status: 'upcoming',
      registrations:0
    };
    
    // Create a new event document
    const newEvent = new EventDetails(eventData);

    // Save the new event to the database
    await newEvent.save();

    // Fetch all users except those with role===admin
    const usersToNotify = await UserDetails.find({ role: { $ne: 'admin' } });

    // Send emails to users about the newly created event 
    for (const user of usersToNotify) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'New Event Added',
        text: `Dear ${user.userName},\n\n` +
          `A new event has been added:\n\n` +
          `Event Name: ${newEvent.eventName}\n` +
          `Location: ${newEvent.location}\n` +
          `Trainer: ${newEvent.trainer}\n` +
          `Start Date: ${newEvent.startDate} : ${newEvent.startTime} \n` +
          `End Date: ${newEvent.endDate} : ${newEvent.endTime}\n` +
          `Prerequisites: ${newEvent.prerequisites}\n\n` +
          `Please check for further details on the platform.\n\n` +
          `Regards,\n` +
          `Employee Learning Platform`
      };

      // Send notification email to the user
      await transporter.sendMail(mailOptions);
    }


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
   
    // Fetch the event details before updating
    const existingEvent = await EventDetails.findById(eventId);

    if (!existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update the event details in the database
    const updatedEvent = await EventDetails.findByIdAndUpdate(eventId, eventDataToUpdate, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Fetch registrations for the specific event
    const registrations = await RegistrationDetails.find({ event_id: eventId });

    // Notify users about the update or cancellation
    for (const registration of registrations) {
      const user = await UserDetails.findById(registration.user_id);
      if (user) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Event Update or Cancellation',
          text: `Dear ${user.userName},\n\n` +
            `The event "${updatedEvent.eventName}" has been updated or cancelled.\n\n` +
            `Details:\n` +
            `Event Name: ${updatedEvent.eventName}\n` +
            `Location: ${updatedEvent.location}\n` +
            `Trainer: ${updatedEvent.trainer}\n` +
            `Start Date: ${updatedEvent.startDate} : ${updatedEvent.startTime} \n` +
            `End Date: ${updatedEvent.endDate} : ${updatedEvent.endTime}\n` +
            `Prerequisites: ${updatedEvent.prerequisites}\n` +
            `Status: ${updatedEvent.status}\n\n` +
            `Please check the updated details on the platform.\n\n` +
            `Regards,\n` +
            `Employee Learning Platform`
        };

        // Send notification email to the user
        await transporter.sendMail(mailOptions);
      }
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
