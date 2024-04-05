const RegistrationDetails = require('../Models/registrationDetails');
const EventDetails = require('../Models/eventDetails');

exports.registerEvent= async (req, res) => {
    try {

      const { event_id, user_id, registeredAt } = req.body;
   
      // Create registration document
      const registration = await RegistrationDetails.create({
        event_id,
        user_id,
        registeredAt
      });

      // Update registrations count in the events table
      await EventDetails.findByIdAndUpdate(event_id, { $inc: { registrations: 1 } });
  
      res.status(201).json({ message: 'Registration successful', registration });
    } catch (error) {
      console.error('Error registering for event:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  