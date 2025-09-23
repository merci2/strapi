//src/App.tsx  MAIN APP COMPONENT 


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import About from './pages/About'; 
import Contact from './pages/Contact';
import BlogListe from './components/BlogList';
import BlogDetail from './components/BlogDetail';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="app">
        {/* Navigation ist auf allen Seiten sichtbar */}
        <Navigation />
        
        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<Home />} />
            
            {/* About Route */}
            <Route path="/about" element={<About />} />
            
            {/* Contact Route */}
            <Route path="/contact" element={<Contact />} />
            
            {/* Blog Routes */}
            <Route path="/blog" element={<BlogListe />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            
            {/* 404 Fallback */}
            <Route path="*" element={
              <div className="page-container">
                <h1>404 - Seite nicht gefunden</h1>
                <p>Die gewünschte Seite existiert nicht.</p>
                <a href="/">Zurück zur Startseite</a>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;