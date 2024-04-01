// // models/UserDetails.js

// const mongoose = require('mongoose');

// const userDetailsSchema = new mongoose.Schema({
//   userName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   defaultPasword:{type: String},
//   role: { type: String, enum: ['user', 'admin'] } ,
//   createdAt: { type: Date, default: Date.now }, 
//   updated: { type: Boolean, default: false },
//   updatedPassword:{type:String},
//   gender:{type: String, enum: ['male', 'female']}
// });

// const UserDetails = mongoose.model('UserDetails', userDetailsSchema);

// module.exports = UserDetails;
