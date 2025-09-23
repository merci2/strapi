// src/pages/Contact.tsx  
import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="page-container">
      <h1>📧 Kontakt</h1>
      <p>
        Hier könntest du ein Kontaktformular oder deine 
        Kontaktinformationen einfügen.
      </p>
      <div className="contact-info">
        <p>📧 E-Mail: beispiel@email.com</p>
        <p>🐦 Twitter: @beispieluser</p>
        <p>💼 LinkedIn: /in/beispieluser</p>
      </div>
    </div>
  );
};

export default Contact;