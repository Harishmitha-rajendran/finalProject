const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Enable CORS for all routes
app.use(cors({ origin: 'http://localhost:5173' }));

// Middleware
app.use(express.json()); // Parse JSON bodies

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, socketTimeoutMS: 50000, connectTimeoutMS: 50000 })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Routes
const userRoutes = require('./Routes/userRoutes');
app.use(userRoutes);

// Middleware to check if the user is logged in
const isLoggedIn = (req, res, next) => {
  // Check if user is logged in
  if (req.user) {
      // User is logged in, proceed to the next middleware
      next();
  } else {
      // User is not logged in, send a message or redirect to login page
      res.status(401).send('You must be logged in to access this route.');
  }
};

// Route that's not available
app.get('/restricted', (req, res) => {
  res.status(404).send('This route is not available.');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


