import React from 'react';
import { Link } from 'react-router-dom';

const EventList = ({ events, loading, onEventUpdate }) => {
  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="event-list">
      <h1>Upcoming Events</h1>
      <div className="events-grid">
        {events.map(event => (
          <EventCard 
            key={event._id} 
            event={event} 
            onRegistration={onEventUpdate}
          />
        ))}
      </div>
    </div>
  );
};

const EventCard = ({ event, onRegistration }) => {
  const availableSeats = event.capacity - (event.currentRegistrations || 0);
  const isFull = availableSeats <= 0;

  return (
    <div className={`event-card ${isFull ? 'full' : ''}`}>
      <h3>{event.title}</h3>
      <p className="event-description">{event.description}</p>
      <div className="event-details">
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {event.time}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Capacity:</strong> {event.capacity} seats</p>
        <p><strong>Available:</strong> 
          <span className={isFull ? 'full-text' : 'available-text'}>
            {isFull ? 'Waitlist Only' : `${availableSeats} seats available`}
          </span>
        </p>
      </div>
      <Link 
        to={`/register/${event._id}`} 
        className={`btn ${isFull ? 'btn-waitlist' : 'btn-register'}`}
      >
        {isFull ? 'Join Waitlist' : 'Register Now'}
      </Link>
    </div>
  );
};

export default EventList;