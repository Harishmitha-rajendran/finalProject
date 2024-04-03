import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import './AddEvent.css';
import { ToastContainer, toast} from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import PropTypes from 'prop-types'; // Import PropTypes

function AddEvent( { handleClose } ) {
  // const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    startDate: new Date(),
    startTime: '',
    endDate: new Date(),
    endTime: '',
    location: '',
    trainer: '',
    prerequisites: '',
    capacity:'',
  });

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  const handleSave = async () => {
      try {
        await axios.post('http://localhost:3000/addEvent', formData);
        toast.success('Event details saved successfully'); 
        handleClose();
        
        // Clear the form data
      setFormData({
      eventName: '',
      description: '',
      startDate: new Date(),
      startTime: '',
      endDate: new Date(),
      endTime: '',
      location: '',
      trainer: '',
      prerequisites: ''})


      } catch (error) {
        console.error('Error saving event details:', error);
        toast.error('Error saving event details'); 
      }


    };


  return (
    <>
      {/* <Button variant="primary" onClick={handleShow}>
        Add Event
      </Button> */}

      <Modal
        show={true}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="eventName">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                name='eventName'
                type="text"
                value={formData.eventName}
                onChange={handleChange}
                placeholder="Enter event name"
              />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter event description"
              />
            </Form.Group>
            <Form.Group controlId="startDateTime">
             <Form.Label>Start Date and Time</Form.Label>
              <div className="col">
               <input
                 name='startDate'
                 type="date"
                 className="form-control"
                 value={formData.startDate}
                 onChange={handleChange}
               />
               <input
                name='startTime'
                type="time"
                className="form-control"
                value={formData.startTime}
                onChange={handleChange}
               />
              </div>
           </Form.Group>

          <Form.Group controlId="endDateTime">
            <Form.Label>End Date and Time</Form.Label>
             <div className="col">
              <input
              name='endDate'
              type="date"
              className="form-control"
              value={formData.endDate}
              onChange={handleChange}
              />
            <input
            name='endTime'
            type="time"
            className="form-control"
            value={formData.endTime}
            onChange={handleChange}
            />
           </div>
          </Form.Group>


            <Form.Group controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter event location"
              />
            </Form.Group>
            <Form.Group controlId="trainer">
              <Form.Label>Trainer</Form.Label>
              <Form.Control
                name="trainer"
                type="text"
                value={formData.trainer}
                onChange={handleChange}
                placeholder="Enter event trainer"
              />
            </Form.Group>
            <Form.Group controlId="prerequisites">
              <Form.Label>Prerequisites</Form.Label>
              <Form.Control
                name="prerequisites"
                type="text"
                value={formData.prerequisites}
                onChange={handleChange}
                placeholder="Enter event prerequisites"
              />
            </Form.Group>
            <Form.Group controlId="capacity">
  <Form.Label>Capacity</Form.Label>
  <Form.Control
    name="capacity"
    type="number" // Change the type to "number"
    value={formData.capacity} // Assuming formData.capacity holds the value for capacity
    onChange={handleChange} // Assuming handleChange function handles changes in the form data
    placeholder="Enter event capacity"
  />
</Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary"  onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer/>
    </>
  );
}

// Add prop validation
AddEvent.propTypes = {
  handleClose: PropTypes.func.isRequired // Ensure handleClose is a function and is required
};

export default AddEvent;
