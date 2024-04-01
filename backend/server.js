const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const app = express();

// Enable CORS for all routes
app.use(cors({ origin: 'http://localhost:5173' }));

// Middleware
app.use(express.json()); // Parse JSON bodies

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, socketTimeoutMS: 30000,connectTimeoutMS: 30000})
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

    if (!user) {
      // User not found, send 404 status code
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.password === password) {
      // Password matches, login successful
      return res.json({ success: true, message: 'Login successful' });
    } else {
      // Password doesn't match, send 401 status code
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

app.post('/sendVerificationMail', async (req, res) => {
  const { email } = req.body;
 console.log('called')
  try {
    const user = await UserDetails.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
      console.log('not fnd')
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: 'Click the following link to reset your password: http://localhost:3000/resetPassword'
    };

    await transporter.sendMail(mailOptions);
    console.log('sending mail')
    res.status(200).json({ success: true, message: 'Verification mail sent successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/resetPassword', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await UserDetails.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Password reset successfully' });
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