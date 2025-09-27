// src/components/Navigation.tsx  

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/navigation.css';

const Navigation: React.FC = () => {
  // useLocation Hook gibt uns die aktuelle Route
  const location = useLocation();

  return (
    <nav className="main-navigation">
      <div className="nav-container">
        {/* Logo/Brand */}
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            {/* <span className="brand-icon">🚀</span> */}
            <span className="brand-text">AI Chatbots</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-btn ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          
          <Link 
            to="/about" 
            className={`nav-btn ${location.pathname === '/about' ? 'active' : ''}`}
          >
            About
          </Link>
          
          {/* STRAPI BLOG BUTTON - Version 5 (Minimal Line) */}
          <Link 
            to="/blog" 
            className={`nav-btn ${location.pathname.startsWith('/blog') ? 'active' : ''}`}
          >
            Notes
          </Link>
          
          <Link 
            to="/contact" 
            className={`nav-btn ${location.pathname === '/contact' ? 'active' : ''}`}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;