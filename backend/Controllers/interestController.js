const InterestDetails = require('../Models/interestDetails');

exports.addLike = async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    // Update the interest details by adding the user ID to the array of likes
    const updatedInterest = await InterestDetails.findOneAndUpdate(
      { event_id: eventId },
      { $addToSet: { likes: userId } }, // $addToSet ensures no duplicates in the array
      { upsert: true, new: true }  // creates new document if not exists, returns updated document
    );

    res.status(200).json(updatedInterest);
  } catch (error) {
    console.error('Error adding like:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};