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

    const startDate = new Date(formData.startDate);
    const startTime = formData.startTime.split(':'); // Split time into hours and minutes
    const startTimeHours = parseInt(startTime[0]);
    const startTimeMinutes = parseInt(startTime[1]);

    // Convert endDate and endTime to Date objects
    const endDate = new Date(formData.endDate);
    const endTime = formData.endTime.split(':'); // Split time into hours and minutes
    const endTimeHours = parseInt(endTime[0]);
    const endTimeMinutes = parseInt(endTime[1]);

    // Get the current date/time
    const currentDate = new Date();

    // Create a new Date object for the startTime
    const combinedStartDateTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startTimeHours, startTimeMinutes);
   
    // Create a new Date object for the endTime
    const combinedEndDateTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endTimeHours, endTimeMinutes);

    // Check if combinedEndDateTime is before combinedStartDateTime
    if (combinedEndDateTime < combinedStartDateTime) {
      toast.error('End date and time should be after start date and time');
      return; // Don't proceed further if the end date and time are before the start date and time
  }

    // Check if combinedStartDateTime is in the past
    if (combinedStartDateTime < currentDate) {
        toast.error('Please select a future start date and time');
        return; // Don't proceed further if the start date and time are in the past
    }

    // Check if combinedEndDateTime is in the past
    if (combinedEndDateTime < currentDate) {
        toast.error('Please select a future end date and time');
        return; // Don't proceed further if the end date and time are in the past
    }

    
 

      try {
        await axios.post('http://localhost:3000/addEvent', formData);
        handleClose();
        toast.success('Event details saved successfully'); 
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

      <Modal
        show={true}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{color:'#19105B'}}>Add Event</Modal.Title>
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
    type="number" 
    value={formData.capacity} 
    onChange={handleChange} 
    placeholder="Enter event capacity"
  />
</Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>
            Close
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
     
    </>
  );
}

// Add prop validation
AddEvent.propTypes = {
  handleClose: PropTypes.func.isRequired // Ensure handleClose is a function and is required
};

export default AddEvent;
