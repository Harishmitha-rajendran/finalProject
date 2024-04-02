import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch event data from the backend
    axios.get('http://localhost:3000/events')
      .then(response => {
        setEvents(response.data); // Set the fetched events in the state
      })
      .catch(error => {
        console.error('Error fetching event data:', error);
      });
  }, []); // Empty dependency array to fetch data only once when the component mounts

  return (
    <div className="events-list">
      {events.map(event => (
        <div key={event._id} className="event-card">
          <h2>{event.eventName}</h2>
          <p>Description: {event.description}</p>
          <p>Start Date: {new Date(event.startDate).toLocaleDateString()}</p>
          <p>Start Time: {event.startTime}</p>
          <p>End Date: {new Date(event.endDate).toLocaleDateString()}</p>
          <p>End Time: {event.endTime}</p>
          <p>Location: {event.location}</p>
          <p>Trainer: {event.trainer}</p>
          <p>Prerequisites: {event.prerequisites}</p>
        </div>
      ))}
    </div>
  );
}

export default Events;
