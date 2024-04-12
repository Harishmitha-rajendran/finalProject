const UserDetails = require('../Models/userDetails');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
//const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // Import JWT library

function generateRandomPassword() {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
  
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
  
    return password;
  }

const newPassword=generateRandomPassword()

// Define transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '20bcs004@gmail.com', 
      pass: 'tiin okwz ndcs iuog'   
    }
  });
  

exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await UserDetails.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if ( passwordMatch) { //   password==user.password
        return res.json({ success: true, message: 'Login successful', userId: user._id });

      } else {
        return res.status(401).json({ success: false, message: 'Invalid password' });
      }
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await UserDetails.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (passwordMatch) {
//       // Generate JWT token
//       const token = jwt.sign({ userId: user._id }, 'harishmithaaaa', { expiresIn: '1h' });

//       return res.json({ success: true, message: 'Login successful', token, userId: user._id });
//     } else {
//       return res.status(401).json({ success: false, message: 'Invalid password' });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     return res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };

  exports.createUser = async (req, res) => {
    try {
        // Check if the user already exists
        const existingUser = await UserDetails.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        // Generate a random password for the user
        const newPassword = generateRandomPassword();

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        //console.log(hashedPassword)

        // Create a new user with the hashed password
        const userData = {
            ...req.body,
            password: hashedPassword,
            createdAt: new Date(),
            updated: false,
        };

        const newUser = await UserDetails.create(userData);

        // Send success response and then send mail
        res.status(200).json({ success: true, message: 'User created successfully and email sent.' });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userData.email,
            subject: 'Welcome to Employee Learning Platform',
            html: `<p>Hello ${userData.userName},</p>
               <p>Your account has been successfully created on the Employee Learning Platform.</p>
               <p>Your default password is: ${newPassword}</p>
               <p>Please click <a href=http://localhost:5173/ResetPassword/${userData.email}>here</a> to reset your password.</p>`
        };

        // Send email to the user
        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.sendVerificationMail= async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await UserDetails.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // else user found, send success msg and then mail
      res.status(200).json({ success: true, message: 'Verification mail sent successfully' });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        text: `Click the following link to reset your password: http://localhost:5173/ResetPassword/${email}`
      };
  
      await transporter.sendMail(mailOptions);
      
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
  
  
  
  
exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
  
    try {
      // Hash the new password before updating it in the database
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      const updatedUser = await UserDetails.findOneAndUpdate(
        { email },
        { password: hashedPassword, updated: true }
      );
  
      if (updatedUser) {
        return res.status(200).json({ success: true, message: 'Password reset successful' });
      } else {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

  