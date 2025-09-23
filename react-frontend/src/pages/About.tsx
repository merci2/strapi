// src/pages/About.tsx
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="page-container">
      <h1>👤 Über mich</h1>
      <p>
        Hier erfährst du mehr über mich und meine Projekte. 
        Diese Seite zeigt, wie die Navigation zwischen verschiedenen 
        Bereichen der Website funktioniert.
      </p>
      <p>
        Der Blog wird vollständig von Strapi CMS verwaltet und zeigt 
        die Integration zwischen React Frontend und Headless CMS.
      </p>
    </div>
  );
};

export default About;