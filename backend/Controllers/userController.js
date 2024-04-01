// // controllers/userController.js
// const UserDetails = require('../Models/userDetails');
// const nodemailer = require('nodemailer');


// function generateRandomPassword() {
//       const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=";
//       let password = "";
    
//       for (let i = 0; i < 8; i++) {
//         const randomIndex = Math.floor(Math.random() * charset.length);
//         password += charset[randomIndex];
//       }
    
//       return password;
//     }
//     const newPassword = generateRandomPassword();

//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//           auth: {
//             user: '20bcs004@gmail.com',
//             pass: 'tiin okwz ndcs iuog'
//           }
//    });

// exports.createUser = async (req, res) => {
//   try {
//     const userData = {
//       ...req.body,
//       defaultPasword: generateRandomPassword(),
//       createdAt: new Date(),
//       updated: false,
//     };

//     const newUser = await UserDetails.create(userData);

//     const mailOptions = {
//       from: 'your-email@gmail.com',
//       to: userData.email, // Use userData.email instead of email
//       subject: 'Welcome to Employee Learning Platform',
//       html: `<p>Hello ${userData.userName},</p>
//              <p>Your account has been successfully created on the Employee Learning Platform.</p>
//              <p>Your default password is: ${newPassword}</p>
//              <p>Please click <a href=http://localhost:5173/ResetPassword/${userData.email}>here</a> to reset your password.</p>`
//     };


//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ success: true, message: 'User created successfully and email sent.' });
//   } catch (error) {
//     console.error('Error creating user:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };

// exports.sendVerificationMail = async (req, res) => {
//     const { email } = req.body;

//       try {
//         const user = await UserDetails.findOne({ email });
//         if (!user) {
//           return res.status(404).json({ success: false, message: 'User not found' });
//         }
    
//         const mailOptions = {
//           from: process.env.EMAIL_USER,
//           to: email,
//           subject: 'Password Reset',
//           text: `Click the following link to reset your password: http://localhost:5173/ResetPassword/${email}`
//         };
    
//         await transporter.sendMail(mailOptions);
//         res.status(200).json({ success: true, message: 'Verification mail sent successfully' });
//       } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//       }
// };

// exports.resetPassword = async (req, res) => {

//   try {
//     // Find user by email and update the password
//     const updatedUser = await UserDetails.findOneAndUpdate(
//       { email }, // Filter criteria: Find user by email
//       { updatedPassword: newPassword, updated: true }// Update: Set new password and mark as updated
//     );

//     // Check if user exists and password is updated
//     if (updatedUser) {
//       return res.status(200).json({ success: true, message: 'Password reset successfull' });
//     } else {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     return res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// }
