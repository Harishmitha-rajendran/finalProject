const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcrypt');

const app = express();

// Enable CORS for all routes
app.use(cors({ origin: 'http://localhost:5173' }));

// Middleware
app.use(express.json()); // Parse JSON bodies

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// UserDetails schema
const userDetailsSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password:{type: String, required: true},
  role: { type: String, enum: ['user', 'admin'] } 
});

// Models
const UserDetails = mongoose.model('UserDetails', userDetailsSchema);

// Routes
// app.get('/',(req,res)=>{
//     res.send('Hello, World!');
// })

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find user by email in the database
      const user = await UserDetails.findOne({ email });
      console.log(user)
      // Check if user exists and password matches
      if (user) {
          // Check if the password matches
          if (user.password === password) {
            console.log("jolly")
              res.json({ success: true, message: 'Login successful' });
          } else {
              res.json({ success: false, message: 'Invalid password' });
              console.log("galli")
          }
      } else {
          // User not found
          res.status(401).json({ success: false, message: 'Invalid email ' });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
  });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});