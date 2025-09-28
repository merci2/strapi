// react-frontend/src/pages/Contact.tsx

import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="page-container">
      <div className="contact-header">
        <h1>📧 Kontakt</h1>
        <p className="contact-lead">
          Hier könntest du ein Kontaktformular oder deine 
          Kontaktinformationen einfügen.
        </p>
      </div>
      
      <div className="contact-info">
        <p>📧 E-Mail: beispiel@email.com</p>
        <p>🐦 Twitter: @beispieluser</p>
        <p>💼 LinkedIn: /in/beispieluser</p>
      </div>
    </div>
  );
};

export default Contact;