const UserDetails = require('../Models/userDetails');

exports.checkAdminStatus = async (req, res) => {
  const userId = req.params.id.replace(/^"(.*)"$/, '$1');

  try {
    const user = await UserDetails.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check if the user is an admin based on some criteria, e.g., user role
    const isAdmin = user.role === "admin"; 
    
    // Return true if the user is an admin, false otherwise
    res.json({ success: true, isAdmin });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
