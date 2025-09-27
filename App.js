import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import EventList from './Components/EventList.js';
import EventRegistration from './Components/EventRegistration.js';
import AdminPanel from './Components/AdminPanel.js';
import Navbar from './Components/Navbar.js';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchEvents();
  }, [refreshTrigger]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/events`);
      console.log('Fetched events:', response.data); // Debug log
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataUpdate = () => {
    console.log('Refreshing data...'); // Debug log
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route 
              path="/" 
              element={
                <EventList 
                  events={events} 
                  loading={loading} 
                  onEventUpdate={handleDataUpdate} 
                />
              } 
            />
            <Route 
              path="/register/:eventId" 
              element={
                <EventRegistration onRegistrationSuccess={handleDataUpdate} />
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminPanel 
                  events={events} 
                  onDataUpdate={handleDataUpdate} 
                  loading={loading}
                />
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;