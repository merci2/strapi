// src/pages/About.tsx
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="page-container">
      <div className="about-header">
        <h1>👤 Über mich</h1>
        <p className="about-lead">
          Erfahre mehr über meine Projekte und die Technologien, die ich verwende.
        </p>
      </div>
      
      <div className="about-content">
        <div className="about-section">
          <h2>🚀 Meine Mission</h2>
          <p>
            Diese Seite zeigt, wie die Navigation zwischen verschiedenen 
            Bereichen der Website funktioniert und demonstriert die Integration 
            zwischen React Frontend und Headless CMS.
          </p>
          <p>
            Der Blog wird vollständig von Strapi CMS verwaltet und bietet 
            eine moderne Lösung für Content-Management mit maximaler Flexibilität.
          </p>
        </div>
        
        <div className="about-section">
          <h2>💻 Technologie-Stack</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <h4>Frontend</h4>
              <ul>
                <li>React 18 mit TypeScript</li>
                <li>Vite für schnelle Entwicklung</li>
                <li>Responsive CSS Design</li>
              </ul>
            </div>
            <div className="tech-item">
              <h4>Backend</h4>
              <ul>
                <li>Strapi v5 Headless CMS</li>
                <li>RESTful API</li>
                <li>Content Management</li>
              </ul>
            </div>
            <div className="tech-item">
              <h4>AI Integration</h4>
              <ul>
                <li>Multiple AI Provider</li>
                <li>RAG Implementation</li>
                <li>Performance Testing</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="about-section">
          <h2>🎯 Ziele</h2>
          <p>
            Das Hauptziel dieses Projekts ist es, verschiedene AI-Technologien 
            zu erkunden und deren praktische Anwendungsmöglichkeiten zu demonstrieren. 
            Dabei liegt der Fokus auf:
          </p>
          <ul className="goals-list">
            <li>Vergleichende Analyse verschiedener AI-Modelle</li>
            <li>Implementation von RAG-Lösungen</li>
            <li>Performance-Optimierung</li>
            <li>User Experience Verbesserungen</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;