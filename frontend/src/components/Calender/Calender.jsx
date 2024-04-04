import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import calendar styles
import axios from 'axios';

const localizer = momentLocalizer(moment);

function MyCalendar() {
    const [events, setEvents] = useState([]);
  
    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const response = await axios.get('http://localhost:3000/events');
          const formattedEvents = response.data.map(eventData => {
            // Split date and time strings
            const startDateParts = eventData.startDate.split('T');
            const endDateParts = eventData.endDate.split('T');
            // Combine date and time strings
            const startDateTimeString = startDateParts[0] + 'T' + eventData.startTime;
            const endDateTimeString = endDateParts[0] + 'T' + eventData.endTime;
            // Create JavaScript Date objects
            const startDateTime = new Date(startDateTimeString);
            const endDateTime = new Date(endDateTimeString);
            return {
              start: startDateTime,
              end: endDateTime,
              title: eventData.eventName,
              status: eventData.status // Add status property
            };
          });
          setEvents(formattedEvents);
        } catch (error) {
          console.error('Error fetching event data:', error);
        }
      };
      fetchEvents();
    }, []);
    
    // Function to get event props dynamically based on status
    const getEventProps = (event) => {
      let eventStyle = {};
      switch (event.status) {
        case 'completed':
        case 'cancelled':
          eventStyle = { style: { backgroundColor: 'red' } };
          break;
        case 'ongoing':
          eventStyle = { style: { backgroundColor: 'blue' } };
          break;
        case 'upcoming':
          eventStyle = { style: { backgroundColor: 'green' } };
          break;
        default:
          eventStyle = {};
      }
      return eventStyle;
    };
  
    return (
      <div style={{ height: '100vh' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={getEventProps} 
        />
      </div>
    );
  }
  
  export default MyCalendar;
