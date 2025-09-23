// src/pages/Home.tsx
import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="page-container">
      <div className="hero-section">
        <h1>🏠 Willkommen auf meiner Website</h1>
        <p className="hero-subtitle">
          Entdecke spannende Inhalte und besuche meinen Blog
        </p>
        <div className="hero-actions">
          <a href="/blog" className="cta-button">
            Blog besuchen →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;

