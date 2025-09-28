// src/pages/Home.tsx
import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="page-container">
      <div className="hero-section">
        <h1>💬 AI Chatbots</h1>
        <div className="hero-subtitle">
          <p>Tests, also incl. RAG solutions:</p>
          <ul>
            <li>Mistral</li>
            <li>Apertus</li>
            <li>MS AI Foundry GPT5</li>
            <li>coursera: together.ai</li>
            <li>Alibaba: qwen</li>
            <li>Llama</li>
            <li>n8n</li>
          </ul>
        </div>
        <div className="hero-actions">
          <a href="/blog" className="cta-button">
            Blog notes ➡️
          </a>
        </div>
      </div>
      
      {/* Zusätzlicher Content-Bereich für bessere Desktop-Nutzung */}
      <div className="content-section">
        <div className="feature-grid">
          <div className="feature-card">
            <h3>🤖 AI Integration</h3>
            <p>Experimentiere mit verschiedenen AI-Modellen und entdecke ihre einzigartigen Fähigkeiten.</p>
          </div>
          <div className="feature-card">
            <h3>📊 RAG Solutions</h3>
            <p>Retrieval-Augmented Generation für verbesserte und kontextbezogene AI-Antworten.</p>
          </div>
          <div className="feature-card">
            <h3>⚡ Performance Tests</h3>
            <p>Vergleichende Analysen verschiedener AI-Plattformen und deren Leistungsfähigkeit.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

