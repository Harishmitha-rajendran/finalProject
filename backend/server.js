// //server.js

// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// require('dotenv').config();
// const userRoutes = require('./Routes/userRoutes');

// const app = express();

// app.use(cors({ origin: 'http://localhost:5173' }));
// app.use(express.json());

// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true ,socketTimeoutMS: 30000,connectTimeoutMS: 30000})
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Error connecting to MongoDB:', err));

// app.use('/api/users', userRoutes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });





const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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
  defaultPasword:{type: String},
  role: { type: String, enum: ['user', 'admin'] } ,
  createdAt: { type: Date, default: Date.now }, 
  updated: { type: Boolean, default: false },
  updatedPassword:{type:String},
  gender:{type: String, enum: ['male', 'female']}
});

// Models
const UserDetails = mongoose.model('UserDetails', userDetailsSchema);

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

function generateRandomPassword() {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=";
  let password = "";

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}
// Call the function to generate the password
const newPassword = generateRandomPassword();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '20bcs004@gmail.com',
    pass: 'tiin okwz ndcs iuog'
  }
});


// Create a new user route
app.post('/createUser', async (req, res) => {
  try {
    // Generate createdAt and updatedAt timestamp
    const userData = {
      ...req.body,
      defaultPasword:generateRandomPassword(),
      createdAt: new Date(),
      updated:false,
    };

    // Create a new user based on the request body
    const newUser = await UserDetails.create(userData);

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: userData.email, // Use userData.email instead of email
      subject: 'Welcome to Employee Learning Platform',
      html: `<p>Hello ${userData.userName},</p>
             <p>Your account has been successfully created on the Employee Learning Platform.</p>
             <p>Your default password is: ${newPassword}</p>
             <p>Please click <a href=http://localhost:5173/ResetPassword/${userData.email}>here</a> to reset your password.</p>`
    };

    await transporter.sendMail(mailOptions);

    // Send a single response indicating successful user creation
    res.status(200).json({ success: true, message: 'User created successfully and email sent.' });
  } catch (error) {
    console.error('Error creating user:', error);
    // Send a single response indicating an internal server error
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Function to generate a random token
// const generateToken = () => {
//   return crypto.randomBytes(20).toString('hex');
// };


app.post('/sendVerificationMail', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserDetails.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Example usage
    // const token = generateToken();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: http://localhost:5173/ResetPassword/${email}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Verification mail sent successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// app.get('/resetPassword', (req, res) => {
//   const { token } = req.query;
  
//   // Render the ResetPassword page and pass the token as a prop to the component
//   res.render('ResetPassword', { token });
// });

app.post('/resetPassword', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Find user by email and update the password
    const updatedUser = await UserDetails.findOneAndUpdate(
      { email }, // Filter criteria: Find user by email
      { updatedPassword: newPassword, updated: true }// Update: Set new password and mark as updated
    );

    // Check if user exists and password is updated
    if (updatedUser) {
      return res.status(200).json({ success: true, message: 'Password reset successfull' });
    } else {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
