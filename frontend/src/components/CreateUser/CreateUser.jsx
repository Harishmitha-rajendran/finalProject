import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateUser = () => {
  const [userData, setUserData] = useState({
    userName: '',
    email: '',
    password: '',
    role: '',
    createdAt: '',
    updatedAt: '',
    updatedPassword: '',
    gender: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send user data to the server to create a new user
      await axios.post('http://localhost:3000/createUser', userData);
      toast.success('User created successfully. Kindly check your mail');
      // Clear the form fields after successful submission
      setUserData({
        userName: '',
        email: '',
        role: '',
        gender: ''
      });
    } catch (error) {
     toast.error('Failed to create user. Please try again.');
    }
  };

  return (
    <div className='container'>
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>User Name:</label>
          <input
            type='text'
            name='userName'
            value={userData.userName}
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-group'>
          <label>Email:</label>
          <input
            type='email'
            name='email'
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-group'>
          <label>Role:</label>
          <select name='role' value={userData.role} onChange={handleChange} required>
            <option value=''>Select Role</option>
            <option value='admin'>Admin</option>
            <option value='user'>User</option>
          </select>
        </div>
        <div className='form-group'>
          <label>Gender:</label>
          <select name='gender' value={userData.gender} onChange={handleChange} required>
            <option value=''>Select Gender</option>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
            <option value='other'>Other</option>
          </select>
        </div>
        <button type='submit'>Create User</button>
      </form>
     <ToastContainer/>
    </div>
  );
};

export default CreateUser;
