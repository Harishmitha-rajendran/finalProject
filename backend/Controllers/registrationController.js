const RegistrationDetails = require('../Models/registrationDetails');
const EventDetails = require('../Models/eventDetails');
const InterestDetails = require('../Models/interestDetails');
const UserDetails = require('../Models/userDetails');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '20bcs004@gmail.com', 
    pass: 'tiin okwz ndcs iuog'   
  }
});

// function to register for an event by user
exports.registerEvent = async (req, res) => {
  try {
    const { event_id, user_id, registeredAt } = req.body;   
    
    const event = await EventDetails.findById(event_id);

    // Fetch user details
    const user = await UserDetails.findById(user_id);
    //if user not found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if the event has reached its capacity
    if (event.registrations >= event.capacity) {

      //send err msg and then mail
      res.status(400).json({ message: 'Registrations are closed' })

    // Registrations are closed, add the user to interestDetails, send mail to user
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Event Registration Closed',
      text: `Dear ${user.userName},\n\n` +
        `We are sorry to say that the registrations are closed for the event : ${event.eventName} \n\n` +
        `We will notify you when there is any event for ${event.eventName} in the future `+
        `Regards,\n` +
        `Employee Learning Platform`
    };

      await transporter.sendMail(mailOptions);

       // Registrations are closed, add the user to interestDetails
      await InterestDetails.findOneAndUpdate(
        { event_id: event_id },
        { $addToSet: { likes: user_id } },
        { upsert: true }
      );


    return ;
    }

    // if registration are open---- Increment registrations count in the events table
    await EventDetails.findByIdAndUpdate(event_id, { $inc: { registrations: 1 } });

    // Create registration document
    const registration = await RegistrationDetails.create({
      event_id,
      user_id,
      registeredAt
    });

    //send success msg and then mail
    res.status(201).json({ message: 'Registration successful', registration });

    // Send confirmation email to the user
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Event Registration Confirmation',
      text: `Dear ${user.userName},\n\n` +
        `Thank you for registering for the event.\n\n` +
        `Event Name: ${event.eventName}\n` +
        `Start Time: ${event.startDate} :${event.startTime} \n` +
        `End Time: ${event.endDate} :${event.endTime} \n` +
        `Prerequisites: ${event.prerequisites}\n` +
        `Location: ${event.location}\n` +
        `Trainer: ${event.trainer}\n\n` +
        `Have a great learning !\n`+
        `Regards,\n` +
        `Employee Learning Platform`
    };

    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Controller function to fetch all events registered by a specific user
exports.getRegisteredEvents = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Find registrations for the given user ID
    const registrations = await RegistrationDetails.find({ user_id: userId });
    
    // Extract event IDs from registrations
    const eventIds = registrations.map(registration => registration.event_id);
   
    // Find events corresponding to the retrieved event IDs
    const events = await EventDetails.find({ _id: { $in: eventIds } });
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching events for user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//function to check if the user already registered for the event 
  exports.checkRegistration = async (req, res) => {
    
    try {
      const eventId = req.params.eventId;
      const userId = req.params.userId;
  
      // Check if there is any registration matching the given event ID and user ID
      const existingRegistration = await RegistrationDetails.findOne({ event_id: eventId, user_id: userId });
      
      if (existingRegistration) {
        // If registration exists, return it
        res.status(200).json(existingRegistration);
      } else {
        // If no registration exists, return an empty array
        res.status(200).json([]);
      }
    } catch (error) {
      console.error('Error checking registration:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };