// src/components/BlogList.tsx


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { StrapiArticle } from '../types';
import { getAlleArtikel, getBildUrl } from '../services/api';
import '../styles/bloglist.css';

const BlogList: React.FC = () => {
  // State für die Artikel-Liste
  const [artikel, setArtikel] = useState<StrapiArticle[]>([]);
  // State für Loading-Zustand
  const [loading, setLoading] = useState<boolean>(true);
  // State für Fehler
  const [error, setError] = useState<string | null>(null);

  // useEffect Hook lädt Artikel beim ersten Render
  useEffect(() => {
    const ladeArtikel = async () => {
      try {
        setLoading(true);                      // Zeige Loading-Indikator
        const artikelData = await getAlleArtikel(); // API-Aufruf
        setArtikel(artikelData);               // Setze Artikel in State
        setError(null);                        // Lösche etwaige Fehler
      } catch (err) {
        setError('Artikel konnten nicht geladen werden'); // Setze Fehlermeldung
        console.error('Fehler:', err);
      } finally {
        setLoading(false);                     // Verstecke Loading-Indikator
      }
    };

    ladeArtikel(); // Führe die Funktion aus
  }, []); // Leeres Dependency Array = nur einmal ausführen

  // Zeige Loading-Zustand
  if (loading) {
    return (
      <div className="blog-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Artikel werden geladen...</p>
        </div>
      </div>
    );
  }

  // Zeige Fehler-Zustand
  if (error) {
    return (
      <div className="blog-container">
        <div className="error">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="retry-btn"
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  // Zeige Artikel-Liste
  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>📝 Strapi Blog</h1>
        <p className="blog-subtitle">
          Entdecke interessante Artikel und Geschichten
        </p>
      </div>

      {artikel.length === 0 ? (
        // Fallback wenn keine Artikel vorhanden
        <div className="no-articles">
          <h2>Keine Artikel vorhanden</h2>
          <p>Erstelle deinen ersten Artikel im Strapi Admin Panel!</p>
          <a 
            href="http://localhost:1337/admin" 
            target="_blank" 
            rel="noopener noreferrer"
            className="admin-link"
          >
            Zu Strapi Admin →
          </a>
        </div>
      ) : (
        // Grid Layout für Artikel-Karten
        <div className="artikel-grid">
          {artikel.map((artikel) => (
            <article 
              key={artikel.documentId}              // Unique Key für React
              className="artikel-karte"
            >
              {/* Cover-Bild anzeigen falls vorhanden */}
              {artikel.cover && (
                <div className="artikel-cover">
                  <img 
                    src={getBildUrl(artikel.cover.url)}
                    alt={artikel.cover.alternativeText || artikel.title}
                    loading="lazy"  // Lazy Loading für Performance
                  />
                </div>
              )}
              
              <div className="artikel-content">
                {/* Kategorie Badge */}
                {artikel.category && (
                  <span className="kategorie-badge">
                    {artikel.category.name}
                  </span>
                )}

                {/* Artikel Titel */}
                <h2 className="artikel-titel">
                  <Link to={`/blog/${artikel.documentId}`}>
                    {artikel.title}
                  </Link>
                </h2>

                {/* Beschreibung */}
                <p className="artikel-beschreibung">
                  {artikel.description || 'Keine Beschreibung verfügbar.'}
                </p>

                {/* Artikel Footer mit Datum und Link */}
                <div className="artikel-footer">
                  <span className="artikel-datum">
                    {new Date(artikel.publishedAt || artikel.createdAt).toLocaleDateString('de-DE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  
                  <Link 
                    to={`/blog/${artikel.documentId}`}
                    className="weiterlesen-link"
                  >
                    Weiterlesen →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;