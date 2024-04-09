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
  const [filter, setFilter] = useState('all'); 
  const [isAdmin, setIsAdmin] = useState(true);
  const [userId,setUserId]=useState('')
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [showRegisteredEvents,setShowRegisteredEvents]=useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResultEvents, setSearchResultEvents] = useState([]);

  useEffect(() => {
    // Fetch user ID from localStorage
    setUserId(localStorage.getItem('userId'))
    // Make an HTTP request to the backend to check if the user is an admin
    const checkAdminStatus = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/adminStatus/${userId}`);
            setIsAdmin(response.data.isAdmin);
        } catch (error) {
            console.error('Error checking admin status:', error);
        }
    };

    // Call the function to check admin status
    if (userId) {
        checkAdminStatus();
    }

}, [userId]);


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
  }, [events, filter,userRegistrations]); // Include filter in dependency array

  const handleEdit = (event) => {
    setEditedEvent(event);
    setShowEditModal(true);
  };
  
  //save edited details
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

  //cancel editing
  const handleCancelEdit = () => {
    setShowEditModal(false);
  };

  //handle changes while editing details
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent({
      ...editedEvent,
      [name]: value,
      editedAt: new Date().toISOString()
    });
  };

  //cancel event
  const handleCancelEvent = async (event) => {
    try {
      const updatedEvent = { ...event, status: 'cancelled', cancelledAt: new Date().toISOString()};
      await axios.put(`http://localhost:3000/events/${event._id}`, updatedEvent);
      toast.success('Event Cancelled');
      fetchEvents();
    } catch (error) {
      toast.error('Error cancelling event:', error);
    }
  };



 //register for event
  const handleRegister = async (event) => {
    try {
      const user_id = userId.replace(/^"(.*)"$/, '$1');
  
      // Check if the user is already registered for the event
      const response = await axios.get(`http://localhost:3000/registrations/${event._id}/${user_id}`);
  
      if (Object.keys(response.data).length > 0) {
        // User is already registered, show error toast
        toast.error('You already registered for this event');
      } else {
        // User is not registered, proceed with registration
        const registrationData = {
          event_id: event._id,
          user_id: user_id,
          registeredAt: new Date().toISOString()
        };
        await axios.post('http://localhost:3000/registrations', registrationData);
  
        // Registration successful, show success toast
        toast.success('Event Registered Successfully');
        fetchEvents();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message === 'Registrations are closed') {
        // Registrations are closed, show error toast
        toast.error('Registrations for this event are closed');
      } else {
        // Other error occurred, show generic error toast
        toast.error('Error registering for event');
      }
    }
  };
  
  // interest for event
  const handleLike = async (event) => {
    try {
      const user_id= userId.replace(/^"(.*)"$/, '$1');
      // Send a POST request to the backend to add a like for the event
      await axios.post('http://localhost:3000/interests/like', {
        eventId: event._id,
        userId: user_id
      });
      
      // Display a success toast
      toast.success('Event Liked Successfully');
      
      // Fetch updated events data
      fetchEvents();
    } catch (error) {
      // Display an error toast if something goes wrong
      toast.error('Error liking event');
    }
  };


  // set usestate to filter status
  const filterEvents = (status) => {
    setFilter(status);
    if(status==='registeredevents')
     setShowRegisteredEvents(true)
    else
     setShowRegisteredEvents(false)
  };

  //filter the events
  const filteredEvents = filter === 'all' ? events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : !(filter=='registeredevents') ? events.filter(event => event.status === filter) : '  ';

  // count for each status
  const eventCounts = {
    'all': events.length,
    'upcoming': events.filter(event => event.status === 'upcoming').length, // Corrected filter
    'ongoing': events.filter(event => event.status === 'ongoing').length,
    'completed': events.filter(event => event.status === 'completed').length,
    'cancelled': events.filter(event => event.status === 'cancelled').length,
    'registeredevents':userRegistrations.length
  };

  //fetch the events that the user registered for, whenever the userid changes
  useEffect(()=>{

  const user_id = userId.replace(/^"(.*)"$/, '$1');
  const fetchUserRegistrations = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/registeredevents/${user_id}`);
      setUserRegistrations(response.data);     
      
    } catch (error) {
      console.error('Error fetching user registrations:', error);
    }
  };
  
if (userId) {
    fetchUserRegistrations();
  }
}, [userId,userRegistrations]);

const handleSearchInputChange = (event) => {
  const query = event.target.value.toLowerCase();
  setSearchQuery(query);
}

useEffect(() => {

  const filtered = events.filter(event => {   //events or filteredevents
    // Check if any of the fields contain the search query
    return (
      event.eventName.toLowerCase().includes(searchQuery) ||
      event.trainer.toLowerCase().includes(searchQuery) ||
      event.location.toLowerCase().includes(searchQuery) ||
      event.startDate.includes(searchQuery) ||
      event.startTime.includes(searchQuery) ||
      event.endDate.includes(searchQuery) ||
      event.endTime.includes(searchQuery) 
    );
  });

  // Update the state with the filtered events
  setSearchResultEvents(  !showRegisteredEvents ? searchQuery ? filtered : filteredEvents : userRegistrations );
  
}, [searchQuery, events])

  return (
    <div className="events-list container-fluid px-4">

        <div className="col-12 mt-3 p-2 d-flex justify-content-center container-fluid">
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search Events"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>

      <div className="filter-buttons row mb-2">

        <div className="col-2 text-center">
        <span onClick={() => filterEvents('all')} className='status-btn'>All <span className='badg'>{eventCounts['all']}</span>
        </span>
        </div>

{ !isAdmin &&
       <div className="col-2 text-center">
        <span  onClick={() => filterEvents('registeredevents')} className='status-btn'>Registered Events <span className='badg'>{eventCounts['registeredevents']}</span>
        </span >
        </div>
}
       
        <div className="col-2 text-center">
        <span  onClick={() => filterEvents('upcoming')} className='status-btn'>Upcoming <span className='badg'>{eventCounts['upcoming']}</span>
        </span >
        </div>
        <div className="col-2 text-center">
        <span  onClick={() => filterEvents('ongoing')} className='status-btn'>Ongoing <span className='badg'>{eventCounts['ongoing']}</span>
        </span >
        </div>
        <div className="col-2 text-center">
        <span  onClick={() => filterEvents('completed')} className='status-btn'>Completed <span className='badg'>{eventCounts['completed']}</span>
        </span >
        </div>
        <div className="col-2 text-center">
        <span  onClick={() => filterEvents('cancelled')} className='status-btn' >Cancelled <span className='badg'>{eventCounts['cancelled']}</span>
        </span >
      </div>
    </div>


     <div className="events-cards row ">

    { !showRegisteredEvents  ?

       ( searchResultEvents.map(event => (
          <div key={event._id} className={`col-lg-3 col-md-6 ${filter==='all' && (event.status === 'completed' || event.status === 'cancelled' || event.status === 'ongoing') ? 'disabled-card' : ''}`}>
            <div className="card my-2">
              <div className="card-body pb-1">
                <div className='d-flex justify-content-between'>
                  <h5 className="card-title" style={{color:'#19105B'}}>{event.eventName}</h5>
                  <p className='text-center p-0 m-0 status'>{event.status}</p>
                </div>
                <h6 className="card-subtitle mb-2 text-body-secondary mt-2 mb-3">{event.description}</h6>
                <p className="card-text"> Start Time : {new Date(event.startDate).toLocaleDateString()} : {event.startTime} </p>
                <p className="card-text"> End Time : {new Date(event.endDate).toLocaleDateString()} : {event.endTime}</p>
                <p className='card-text'>Location/Meet Link : {event.location} </p>
                <p className='card-text'>Trainer : {event.trainer} </p>
                <p className='card-text'>Prerequisites: {event.prerequisites} </p>
                <p className='card-text'>Capacity: {event.capacity} </p>
                <p className='card-text'>Registrations: {event.registrations} </p>
                <div className='d-flex justify-content-around mb-1'>

{ isAdmin ?
            ( <>
                  <button className={`btn  w-50 me-2 ${!(filter==='all' || filter==='upcoming') ? 'disabled-btn' : ''}`}  onClick={() => handleEdit(event)} style={{backgroundColor:'#FF095C',color:'white'}}>Edit</button>
                  <button  className={`btn  w-50  ${!(filter==='all' || filter==='upcoming') ? 'disabled-btn' : ''}`} onClick={() => handleCancelEvent(event)} style={{backgroundColor:'#FF095C',color:'white'}}>Cancel</button>
              </>
            )
            :
            ( <>
                  <button className={`btn w-50 me-2 ${!(filter==='all' || filter==='upcoming') ? 'disabled-btn' : ''}`}  onClick={() => handleRegister(event)} style={{backgroundColor:'#FF095C',color:'white'}}>Register</button>
                  <button  className={`btn w-50  ${!(filter==='all' || filter==='upcoming') ? 'disabled-btn' : ''}`} onClick={() => handleLike(event)} style={{backgroundColor:'#FF095C',color:'white'}}>Like</button>
              </>
            )
}

                </div>
              </div>
            </div>
          </div>
        ))
     
    ) :

    (  
         userRegistrations.map(event => (
          <div key={event._id} className={`col-lg-3 col-md-6 ${filter === 'all' && (event.status === 'completed' || event.status === 'cancelled' || event.status === 'ongoing') ? 'disabled-card' : ''}`}>
            <div className="card my-3">
            <div className="card-body pb-1">
                <div className='d-flex justify-content-between'>
                  <h5 className="card-title" style={{color:'#19105B'}}>{event.eventName}</h5>
                  <p className='text-center p-0 m-0 status'>{event.status}</p>
                </div>
                <h6 className="card-subtitle mb-2 text-body-secondary mt-2 mb-3">{event.description}</h6>
                <p className="card-text"> Start Time : {new Date(event.startDate).toLocaleDateString()} : {event.startTime} </p>
                <p className="card-text"> End Time : {new Date(event.endDate).toLocaleDateString()} : {event.endTime}</p>
                <p className='card-text'>Location/Meet Link: {event.location} </p>
                <p className='card-text'>Trainer : {event.trainer} </p>
                <p className='card-text'>Prerequisites: {event.prerequisites} </p>
                <p className='card-text'>Capacity: {event.capacity} </p>
                <p className='card-text'>Registrations: {event.registrations} </p>
                <div className='d-flex justify-content-around mb-1'>

{ isAdmin ?
            ( <>
                  <button className={`btn btn-primary w-50 me-2 ${!(filter==='all' || filter==='upcoming') ? 'disabled-btn' : ''}`}  onClick={() => handleEdit(event)}>Edit</button>
                  <button  className={`btn btn-primary w-50  ${!(filter==='all' || filter==='upcoming') ? 'disabled-btn' : ''}`} onClick={() => handleCancelEvent(event)}>Cancel</button>
              </>
            )
            :
            ( <>
                  <button className={`btn btn-primary w-50 me-2 ${!(filter==='all' || filter==='upcoming') ? 'disabled-btn' : ''}`}  onClick={() => handleRegister(event)}>Register</button>
                  <button  className={`btn btn-primary w-50  ${!(filter==='all' || filter==='upcoming') ? 'disabled-btn' : ''}`} onClick={() => handleLike(event)}>Like</button>
              </>
            )
}

                </div>
              </div>
            </div>
          </div>
        ))
    )}
      

{showEditModal && (
        <Modal
        show={true}
        onHide={handleCancelEdit}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{color:'#19105B'}}>Edit Event</Modal.Title>
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
    </div>
  );
}

export default Events;
