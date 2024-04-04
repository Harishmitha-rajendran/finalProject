import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Events.css'
import { Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Events() {
  const [events, setEvents] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedEvent, setEditedEvent] = useState({});
  const [filter, setFilter] = useState('all'); // Default filter is 'all'

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }
    const year = date.getFullYear();
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    return [year, month, day].join('-');
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [events, filter]); // Include filter in dependency array

  const handleEdit = (event) => {
    setEditedEvent(event);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:3000/events/${editedEvent._id}`, editedEvent);
      setShowEditModal(false);
      toast.success('Data updated successfully');
      fetchEvents();
    } catch (error) {
      toast.error('Error saving edited event details');
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent({
      ...editedEvent,
      [name]: value,
      editedAt: new Date().toISOString()
    });
  };

  const handleCancelEvent = async (event) => {
    try {
      const updatedEvent = { ...event, status: 'cancelled', cancelledAt: new Date().toISOString() };
      await axios.put(`http://localhost:3000/events/${event._id}`, updatedEvent);
      toast.success('Event Cancelled');
      fetchEvents();
    } catch (error) {
      toast.error('Error cancelling event:', error);
    }
  };

  const filterEvents = (status) => {
    setFilter(status);
  };

  const filteredEvents = filter === 'all' ? events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : events.filter(event => event.status === filter);

  const eventCounts = {
    'all': events.length,
    'upcoming': events.filter(event => event.status === 'upcoming').length, // Corrected filter
    'ongoing': events.filter(event => event.status === 'ongoing').length,
    'completed': events.filter(event => event.status === 'completed').length,
    'cancelled': events.filter(event => event.status === 'cancelled').length
  };

  return (
    <div className="events-list row p-2">
      <div className="filter-buttons row ">
        <div className="col-2">
        <span  className={`filter-tab ${filter === 'all' ? 'active' : ''}`} 
        onClick={() => filterEvents('all')}>All <span className='badg'>{eventCounts['all']}</span>
        </span>
        </div>
        <div className="col-2">
        <span  onClick={() => filterEvents('upcoming')} >Upcoming <span className='badg'>{eventCounts['upcoming']}</span>
        </span >
        </div>
        <div className="col-2">
        <span  onClick={() => filterEvents('ongoing')} >Ongoing <span className='badg'>{eventCounts['ongoing']}</span>
        </span >
        </div>
        <div className="col-2">
        <span  onClick={() => filterEvents('completed')} >Completed <span className='badg'>{eventCounts['completed']}</span>
        </span >
        </div>
        <div className="col-2">
        <span  onClick={() => filterEvents('cancelled')} >Cancelled <span className='badg'>{eventCounts['cancelled']}</span>
        </span >
      </div>
    </div>
      <div className="events-cards row">
        {filteredEvents.map(event => (
          <div key={event._id} className={`col-lg-3 col-md-6 ${filter==='all' && (event.status === 'completed' || event.status === 'cancelled' || event.status === 'ongoing') ? 'disabled-card' : ''}`}>
            <div className="card my-3">
              <div className="card-body pb-1">
                <div className='d-flex justify-content-between'>
                  <h5 className="card-title">{event.eventName}</h5>
                  <p className='text-center p-0 m-0 status'>{event.status}</p>
                </div>
                <h6 className="card-subtitle mb-2 text-body-secondary mt-2 mb-3">{event.description}</h6>
                <p className="card-text"> Start Time : {new Date(event.startDate).toLocaleDateString()} : {event.startTime} </p>
                <p className="card-text"> End Time : {new Date(event.endDate).toLocaleDateString()} : {event.endTime}</p>
                <p className='card-text'>Location : {event.location} </p>
                <p className='card-text'>Trainer : {event.trainer} </p>
                <p className='card-text'>Prerequisites: {event.prerequisites} </p>
                <p className='card-text'>Capacity: {event.capacity} </p>
                <p className='card-text'>Registrations: {event.registrations} </p>
                <div className='d-flex justify-content-around mb-1'>

                  <button className={`btn btn-primary w-50 me-2 ${!(filter==='all') ? 'disabled-btn' : ''}`}  onClick={() => handleEdit(event)}>Edit</button>
                  <button  className={`btn btn-primary w-50  ${!(filter==='all') ? 'disabled-btn' : ''}`} onClick={() => handleCancelEvent(event)}>Cancel</button>

                  {/* <button className={`btn btn-primary w-50 me-2 ${!(filter==='all') ? 'disabled-btn' : ''}`}  onClick={() => handleRegister(event)}>Register</button>
                  <button  className={`btn btn-primary w-50  ${!(filter==='all') ? 'disabled-btn' : ''}`} onClick={() => handleLike(event)}>Like</button> */}

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
{showEditModal && (
        <Modal
        show={true}
        onHide={handleCancelEdit}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="eventName">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                name='eventName'
                type="text"
                value={editedEvent.eventName} // Populate with edited event's name
                onChange={handleEditChange} // Handle change for event name
                placeholder="Enter event name"
              />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name='description'
                as="textarea"
                rows={3}
                value={editedEvent.description} // Populate with edited event's description
                onChange={handleEditChange} // Handle change for event description
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
                  value={formatDate(editedEvent.startDate)} // Populate with edited event's start date
                  onChange={handleEditChange} // Handle change for event start date
                />
                <input
                  name='startTime'
                  type="time"
                  className="form-control"
                  value={editedEvent.startTime} // Populate with edited event's start time
                  onChange={handleEditChange} // Handle change for event start time
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
                  value={formatDate(editedEvent.endDate)} // Populate with edited event's end date
                  onChange={handleEditChange} // Handle change for event end date
                />
                <input
                  name='endTime'
                  type="time"
                  className="form-control"
                  value={editedEvent.endTime} // Populate with edited event's end time
                  onChange={handleEditChange} // Handle change for event end time
                />
              </div>
            </Form.Group>
            <Form.Group controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                name='location'
                type="text"
                value={editedEvent.location} // Populate with edited event's location
                onChange={handleEditChange} // Handle change for event location
                placeholder="Enter event location"
              />
            </Form.Group>
            <Form.Group controlId="trainer">
              <Form.Label>Trainer</Form.Label>
              <Form.Control
                name='trainer'
                type="text"
                value={editedEvent.trainer} // Populate with edited event's trainer
                onChange={handleEditChange} // Handle change for event trainer
                placeholder="Enter event trainer"
              />
            </Form.Group>
            <Form.Group controlId="prerequisites">
              <Form.Label>Prerequisites</Form.Label>
              <Form.Control
                name='prerequisites'
                type="text"
                value={editedEvent.prerequisites} // Populate with edited event's prerequisites
                onChange={handleEditChange} // Handle change for event prerequisites
                placeholder="Enter event prerequisites"
              />
            </Form.Group>
            <Form.Group controlId="capacity">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                name='capacity'
                type="number"
                value={editedEvent.capacity} // Populate with edited event's capacity
                onChange={handleEditChange} // Handle change for event capacity
                placeholder="Enter event capacity"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelEdit}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      
      )}


    </div>
  );
}

export default Events;
