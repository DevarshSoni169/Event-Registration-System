import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const AdminPanel = ({ events, onDataUpdate }) => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [eventsWithDetails, setEventsWithDetails] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: 0
  });

  // Fetch events with detailed registration counts
  const fetchEventsWithDetails = async () => {
    try {
      const eventsWithRegistrations = await Promise.all(
        events.map(async (event) => {
          try {
            const registrationsResponse = await axios.get(`${API_BASE}/registrations/event/${event._id}`);
            console.log(`Registrations for ${event.title}:`, registrationsResponse.data); // Debug log
            const registeredCount = registrationsResponse.data.filter(reg => reg.status === 'registered').length;
            const waitlistedCount = registrationsResponse.data.filter(reg => reg.status === 'waitlisted').length;
            
            return {
              ...event,
              registeredCount,
              waitlistedCount,
              availableSeats: event.capacity - registeredCount
            };
          } catch (error) {
            console.error(`Error fetching registrations for event ${event._id}:`, error);
            return {
              ...event,
              registeredCount: 0,
              waitlistedCount: 0,
              availableSeats: event.capacity
            };
          }
        })
      );
      setEventsWithDetails(eventsWithRegistrations);
    } catch (error) {
      console.error('Error fetching events with details:', error);
    }
  };

  useEffect(() => {
    if (events.length > 0) {
      fetchEventsWithDetails();
    }
  }, [events]);

  useEffect(() => {
    if (selectedEvent) {
      fetchRegistrations(selectedEvent);
    }
  }, [selectedEvent]);

  const fetchRegistrations = async (eventId) => {
    setLoading(true);
    setError('');
    try {
      console.log(`Fetching registrations for event: ${eventId}`); // Debug log
      const response = await axios.get(`${API_BASE}/registrations/event/${eventId}`);
      console.log('Registrations response:', response.data); // Debug log
      setRegistrations(response.data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setError(`Failed to load registrations: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (registrationId) => {
    if (window.confirm('Are you sure you want to cancel this registration?')) {
      try {
        await axios.put(`${API_BASE}/registrations/${registrationId}/cancel`);
        // Refresh both registrations and events
        if (selectedEvent) {
          fetchRegistrations(selectedEvent);
        }
        if (onDataUpdate) {
          onDataUpdate();
        }
        alert('Registration cancelled successfully!');
      } catch (error) {
        console.error('Error cancelling registration:', error);
        alert('Error cancelling registration');
      }
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/events`, {
        ...newEvent,
        createdBy: 'admin',
        date: new Date(newEvent.date).toISOString()
      });
      setNewEvent({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        capacity: 0
      });
      
      // Refresh events list in parent component
      if (onDataUpdate) {
        onDataUpdate();
      }
      
      alert('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event');
    }
  };

  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
    setRegistrations([]);
    setError('');
  };

  const handleRefresh = () => {
    if (selectedEvent) {
      fetchRegistrations(selectedEvent);
    }
    if (onDataUpdate) {
      onDataUpdate();
    }
    setError('');
  };

  const registered = registrations.filter(r => r.status === 'registered');
  const waitlisted = registrations.filter(r => r.status === 'waitlisted');
  const selectedEventDetails = eventsWithDetails.find(e => e._id === selectedEvent);

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      
      <div className="admin-controls">
        <button 
          onClick={handleRefresh} 
          className="btn btn-refresh"
          disabled={loading}
        >
          {loading ? '🔄 Refreshing...' : '🔄 Refresh Data'}
        </button>
        <div className="admin-stats">
          <span>Total Events: {events.length}</span>
          <span>Total Registrations: {registrations.length}</span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
          <br />
          <small>Check browser console for details</small>
        </div>
      )}
      
      <div className="admin-sections">
        <section className="create-event-section">
          <h2>Create New Event</h2>
          <form onSubmit={handleCreateEvent} className="event-form">
            <div className="form-group">
              <label>Event Title:</label>
              <input
                type="text"
                placeholder="Enter event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                placeholder="Enter event description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date:</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Time:</label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Location:</label>
              <input
                type="text"
                placeholder="Enter event location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Capacity:</label>
              <input
                type="number"
                placeholder="Enter capacity"
                value={newEvent.capacity}
                onChange={(e) => setNewEvent({...newEvent, capacity: parseInt(e.target.value)})}
                min="1"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">Create Event</button>
          </form>
        </section>

        <section className="registrations-section">
          <h2>View Registrations</h2>
          
          <div className="event-selection">
            <div className="form-group">
              <label>Select Event:</label>
              <select 
                value={selectedEvent} 
                onChange={handleEventChange}
                className="event-select"
              >
                <option value="">Choose an event...</option>
                {eventsWithDetails.map(event => (
                  <option key={event._id} value={event._id}>
                    {event.title} ({event.registeredCount || 0}/{event.capacity})
                    {event.availableSeats <= 0 ? ' - FULL' : ''}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedEventDetails && (
              <div className="event-stats-card">
                <h4>Event Statistics</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Capacity:</span>
                    <span className="stat-value">{selectedEventDetails.capacity}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Registered:</span>
                    <span className="stat-value">{selectedEventDetails.registeredCount || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Waitlisted:</span>
                    <span className="stat-value">{selectedEventDetails.waitlistedCount || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Available:</span>
                    <span className={`stat-value ${selectedEventDetails.availableSeats <= 0 ? 'stat-full' : 'stat-available'}`}>
                      {selectedEventDetails.availableSeats <= 0 ? 'FULL' : selectedEventDetails.availableSeats}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {loading && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading registrations...</p>
            </div>
          )}

          {error && !loading && (
            <div className="error-state">
              <p>❌ {error}</p>
              <button onClick={handleRefresh} className="btn btn-primary">
                Try Again
              </button>
            </div>
          )}

          {selectedEvent && !loading && !error && (
            <div className="registrations-list">
              <div className="registered-section">
                <div className="section-header">
                  <h3>✅ Registered Participants ({registered.length})</h3>
                  <span className="section-badge">
                    {registered.length}/{selectedEventDetails?.capacity || 0}
                  </span>
                </div>
                
                {registered.length === 0 ? (
                  <div className="empty-state">
                    <p>No registered participants yet</p>
                  </div>
                ) : (
                  <div className="registrations-grid">
                    {registered.map(reg => (
                      <div key={reg._id} className="registration-card">
                        <div className="registration-info">
                          <h4>{reg.studentName}</h4>
                          <p className="registration-email">{reg.studentEmail}</p>
                          <p className="registration-id">ID: {reg.studentId}</p>
                          <p className="registration-date">
                            Registered: {new Date(reg.registrationDate).toLocaleDateString()}
                          </p>
                        </div>
                        <button 
                          onClick={() => handleCancelRegistration(reg._id)}
                          className="btn btn-cancel"
                        >
                          Cancel
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="waitlisted-section">
                <div className="section-header">
                  <h3>⏳ Waitlisted Participants ({waitlisted.length})</h3>
                </div>
                
                {waitlisted.length === 0 ? (
                  <div className="empty-state">
                    <p>No participants on waitlist</p>
                  </div>
                ) : (
                  <div className="waitlist-grid">
                    {waitlisted.map(reg => (
                      <div key={reg._id} className="waitlist-card">
                        <div className="waitlist-info">
                          <h4>{reg.studentName}</h4>
                          <p className="waitlist-email">{reg.studentEmail}</p>
                          <p className="waitlist-id">ID: {reg.studentId}</p>
                          <div className="waitlist-position">
                            Position: <span className="position-number">#{reg.position}</span>
                          </div>
                          <p className="waitlist-date">
                            Joined: {new Date(reg.registrationDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {!selectedEvent && !loading && !error && (
            <div className="no-event-selected">
              <p>Please select an event to view its registrations</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;