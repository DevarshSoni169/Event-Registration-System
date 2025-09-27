import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const EventRegistration = ({ onRegistrationSuccess }) => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    studentId: ''
  });

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE}/events/${eventId}`);
      setEvent(response.data);
    } catch (error) {
      setMessage('Error loading event details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    // Basic validation
    if (!formData.studentName.trim() || !formData.studentEmail.trim() || !formData.studentId.trim()) {
      setMessage('Please fill in all fields');
      setSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.studentEmail)) {
      setMessage('Please enter a valid email address');
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/registrations`, {
        eventId,
        ...formData
      });

      setMessage(response.data.message);
      
      // Trigger refresh in parent components (AdminPanel and EventList)
      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      }
      
      // Clear form
      setFormData({
        studentName: '',
        studentEmail: '',
        studentId: ''
      });

      // Redirect to home page after successful registration
      if (response.data.status === 'registered' || response.data.status === 'waitlisted') {
        setTimeout(() => {
          navigate('/');
        }, 4000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading event details...</p>
    </div>
  );

  if (!event) return (
    <div className="error-container">
      <div className="error-icon">❌</div>
      <h2>Event Not Found</h2>
      <p>The event you're looking for doesn't exist or has been removed.</p>
      <button onClick={() => navigate('/')} className="btn btn-primary">
        Back to Events
      </button>
    </div>
  );

  const availableSeats = event.capacity - (event.registeredCount || 0);
  const isFull = availableSeats <= 0;
  const registeredCount = event.registeredCount || 0;

  return (
    <div className="registration-page">
      <button onClick={() => navigate('/')} className="btn btn-back">
        ← Back to Events
      </button>
      
      <div className="registration-container">
        <div className="event-info">
          <div className="event-header">
            <h1>{event.title}</h1>
            <div className={`event-status ${isFull ? 'status-full' : 'status-available'}`}>
              {isFull ? '🚫 Full' : '✅ Available'}
            </div>
          </div>
          
          <p className="event-description">{event.description}</p>
          
          <div className="event-details-card">
            <h3>📅 Event Details</h3>
            <div className="detail-item">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{new Date(event.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Time:</span>
              <span className="detail-value">{event.time}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Location:</span>
              <span className="detail-value">{event.location}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Capacity:</span>
              <span className="detail-value">{event.capacity} seats</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Registered:</span>
              <span className="detail-value">{registeredCount} participants</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Available:</span>
              <span className={`detail-value ${isFull ? 'text-danger' : 'text-success'}`}>
                {isFull ? 'Waitlist Only' : `${availableSeats} seats available`}
              </span>
            </div>
          </div>

          {isFull && (
            <div className="waitlist-notice">
              <div className="waitlist-icon">⏳</div>
              <div>
                <h4>This event is currently full</h4>
                <p>You can join the waiting list. We'll notify you if a spot becomes available.</p>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-header">
            <h2> Registration Form</h2>
            <p>Please fill in your details to {isFull ? 'join the waitlist' : 'register for this event'}</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="studentName" className="form-label">
              👤 Full Name *
            </label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="form-input"
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="studentEmail" className="form-label">
              📧 Email Address *
            </label>
            <input
              type="email"
              id="studentEmail"
              name="studentEmail"
              value={formData.studentEmail}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
              className="form-input"
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="studentId" className="form-label">
              🆔 Student ID *
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
              placeholder="Enter your student ID"
              className="form-input"
              disabled={submitting}
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className={`btn ${isFull ? 'btn-waitlist' : 'btn-register'} ${submitting ? 'disabled' : ''}`}
          >
            {submitting ? (
              <>
                <div className="loading-spinner-small"></div>
                Processing...
              </>
            ) : (
              isFull ? 'Join Waitlist' : 'Register Now'
            )}
          </button>

          {message && (
            <div className={`message ${message.includes('successful') || message.includes('successfully') ? 'success' : 'error'}`}>
              <div className="message-icon">
                {message.includes('successful') || message.includes('successfully') ? '✅' : '❌'}
              </div>
              <div className="message-content">
                <strong>{message.includes('successful') || message.includes('successfully') ? 'Success!' : 'Error'}</strong>
                <p>{message}</p>
                {(message.includes('successful') || message.includes('successfully')) && (
                  <small>Redirecting to events page in a few seconds...</small>
                )}
              </div>
            </div>
          )}

          <div className="form-footer">
            <p className="privacy-notice">
              🔒 Your information is secure and will only be used for event registration purposes.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventRegistration;