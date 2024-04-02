import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Form, Button } from 'react-bootstrap';

const CreateUser = ({ handleClose }) => {

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
        const response = await axios.post('http://localhost:3000/createUser', userData);
        handleClose();
        toast.success('User created successfully. Kindly check your mail');
        // Clear the form fields after successful submission
        setUserData({
            userName: '',
            email: '',
            role: '',
            gender: ''
        });
    } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data.message === 'User with this email already exists') {
            toast.error('User with this email already exists');
        } else {
            toast.error('Failed to create user. Please try again.');
        }
    }
};


  return (
    <Modal show={true} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Create User</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUserName">
          <Form.Label>User Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter user name"
            name="userName"
            value={userData.userName}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formRole">
          <Form.Label>Role:</Form.Label>
          <Form.Control as="select" name="role" value={userData.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formGender">
          <Form.Label>Gender:</Form.Label>
          <Form.Control as="select" name="gender" value={userData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Form.Control>
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
          <Button variant="secondary"  onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create 
          </Button>
        </Modal.Footer>
  </Modal>
  );
};

export default CreateUser;
