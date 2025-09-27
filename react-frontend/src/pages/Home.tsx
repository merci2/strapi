// src/pages/Home.tsx
import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="page-container">
      <div className="hero-section">
        <h1>🗪 AI Chatbots</h1>
        <p className="hero-subtitle">
          Tests, also incl. RAG solutions: 
          <ul>
            <li>Mistral</li>
            <li>Apertus</li>
            <li>MS AI Foundry GPT5</li>
            <li>coursera: together.ai</li>
            <li>Alibaba: qwen</li>
            <li>Llama</li>
            <li>n8n</li>
          </ul>
        </p>
        <div className="hero-actions">
          <a href="/blog" className="cta-button">
            Blog notes ➡️
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;

