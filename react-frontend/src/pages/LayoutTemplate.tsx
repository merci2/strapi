// react-frontend/src/pages/LayoutTemplate.tsx

import React, { useState } from 'react';

/**
 * 📚 LERN-TEMPLATE: Systematischer CSS-Aufbau
 * 
 * Dieses Template zeigt dir Schritt für Schritt:
 * 1. Wie man CSS Variables verwendet
 * 2. Wie man responsive Layouts baut
 * 3. Wie man moderne CSS-Techniken anwendet
 * 4. Wie man wiederverwendbare Komponenten erstellt
 */

const LayoutTemplate: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark');
  
  // Theme umschalten
  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="layout-template" data-theme={currentTheme}>
      
      {/* ========================================
          SCHRITT 1: HEADER MIT CSS VARIABLES
          ======================================== */}
      <header className="template-header">
        <div className="container">
          <h1 className="header-title">🎨 CSS Layout Template</h1>
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Theme umschalten"
          >
            {currentTheme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* ========================================
          SCHRITT 2: NAVIGATION MIT FLEXBOX
          ======================================== */}
      <nav className="template-nav">
        <div className="container">
          <ul className="nav-list">
            <li><a href="#typography" className="nav-link">Typography</a></li>
            <li><a href="#layout" className="nav-link">Layout</a></li>
            <li><a href="#components" className="nav-link">Components</a></li>
            <li><a href="#responsive" className="nav-link">Responsive</a></li>
          </ul>
        </div>
      </nav>

      {/* ========================================
          SCHRITT 3: MAIN CONTENT MIT CSS GRID
          ======================================== */}
      <main className="template-main">
        <div className="container">
          
          {/* SEKTION 1: TYPOGRAPHY BEISPIELE */}
          <section id="typography" className="content-section">
            <h2 className="section-title">📝 Typography mit CSS Variables</h2>
            
            <div className="typography-examples">
              <h1 className="demo-h1">Heading 1 - var(--font-size-4xl)</h1>
              <h2 className="demo-h2">Heading 2 - var(--font-size-3xl)</h2>
              <h3 className="demo-h3">Heading 3 - var(--font-size-2xl)</h3>
              
              <p className="demo-paragraph">
                Dies ist ein Paragraph mit <strong>fettem Text</strong> und einem 
                <a href="#" className="demo-link">Link</a>. Die Schriftgröße verwendet 
                var(--font-size-base) und die Zeilenhöhe var(--line-height-relaxed).
              </p>
              
              <code className="demo-code">
                const example = "Code mit var(--font-family-mono)";
              </code>
            </div>
          </section>

          {/* SEKTION 2: LAYOUT BEISPIELE */}
          <section id="layout" className="content-section">
            <h2 className="section-title">🏗️ Layout Techniken</h2>
            
            {/* Flexbox Beispiel */}
            <div className="layout-demo">
              <h3 className="demo-subtitle">Flexbox Layout</h3>
              <div className="flex-container">
                <div className="flex-item">Item 1</div>
                <div className="flex-item">Item 2</div>
                <div className="flex-item">Item 3</div>
              </div>
            </div>

            {/* CSS Grid Beispiel */}
            <div className="layout-demo">
              <h3 className="demo-subtitle">CSS Grid Layout</h3>
              <div className="grid-container">
                <div className="grid-item grid-header">Header</div>
                <div className="grid-item grid-sidebar">Sidebar</div>
                <div className="grid-item grid-content">Main Content</div>
                <div className="grid-item grid-footer">Footer</div>
              </div>
            </div>
          </section>

          {/* SEKTION 3: KOMPONENTEN BEISPIELE */}
          <section id="components" className="content-section">
            <h2 className="section-title">🧩 Wiederverwendbare Komponenten</h2>
            
            <div className="components-grid">
              
              {/* Card Komponente */}
              <div className="component-card">
                <div className="card-header">
                  <h4 className="card-title">Card Komponente</h4>
                </div>
                <div className="card-body">
                  <p>Diese Card verwendet CSS Variables für Padding, Schatten und Border-Radius.</p>
                  <button className="btn btn-primary">Primary Button</button>
                </div>
              </div>

              {/* Button Varianten */}
              <div className="component-card">
                <div className="card-header">
                  <h4 className="card-title">Button Varianten</h4>
                </div>
                <div className="card-body">
                  <div className="button-group">
                    <button className="btn btn-primary">Primary</button>
                    <button className="btn btn-secondary">Secondary</button>
                    <button className="btn btn-success">Success</button>
                    <button className="btn btn-warning">Warning</button>
                    <button className="btn btn-error">Error</button>
                  </div>
                </div>
              </div>

              {/* Input Komponente */}
              <div className="component-card">
                <div className="card-header">
                  <h4 className="card-title">Form Elemente</h4>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label className="form-label">Input Field</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Placeholder Text"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Textarea</label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="Mehrzeiliger Text..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SEKTION 4: RESPONSIVE DESIGN */}
          <section id="responsive" className="content-section">
            <h2 className="section-title">📱 Responsive Design</h2>
            
            <div className="responsive-demo">
              <h3 className="demo-subtitle">Mobile-First Grid</h3>
              <div className="responsive-grid">
                <div className="responsive-item">
                  <h4>Mobile: 100%</h4>
                  <p>Tablet: 50%</p>
                  <p>Desktop: 33%</p>
                </div>
                <div className="responsive-item">
                  <h4>Mobile: 100%</h4>
                  <p>Tablet: 50%</p>
                  <p>Desktop: 33%</p>
                </div>
                <div className="responsive-item">
                  <h4>Mobile: 100%</h4>
                  <p>Tablet: 50%</p>
                  <p>Desktop: 33%</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* ========================================
          SCHRITT 4: FOOTER
          ======================================== */}
      <footer className="template-footer">
        <div className="container">
          <p>&copy; 2025 CSS Layout Template - Erstellt zum Lernen von CSS</p>
        </div>
      </footer>

    </div>
  );
};

export default LayoutTemplate;