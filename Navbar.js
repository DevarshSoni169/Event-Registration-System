import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Event Registration
        </Link>
        <div className="nav-links">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Events
          </Link>
          <Link 
            to="/admin" 
            className={location.pathname === '/admin' ? 'nav-link active' : 'nav-link'}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;