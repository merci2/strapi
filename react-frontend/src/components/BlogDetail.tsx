// src/components/BlogDetail.tsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { StrapiArticle } from '../types';
import { getArtikelById, getBildUrl } from '../services/api';
import '../styles/blogdetail.css'; 

const BlogDetail: React.FC = () => {
  // useParams Hook gibt uns die URL-Parameter (documentId)
  const { id } = useParams<{ id: string }>();
  
  // State für den einzelnen Artikel
  const [artikel, setArtikel] = useState<StrapiArticle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Lade Artikel wenn ID sich ändert
  useEffect(() => {
    const ladeArtikel = async () => {
      if (!id) {
        setError('Artikel ID nicht gefunden');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const artikelData = await getArtikelById(id);
        setArtikel(artikelData);
        setError(null);
      } catch (err) {
        setError('Artikel konnte nicht geladen werden');
        console.error('Fehler:', err);
      } finally {
        setLoading(false);
      }
    };

    ladeArtikel();
  }, [id]); // Führe aus wenn ID sich ändert

  if (loading) {
    return (
      <div className="blog-detail-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Artikel wird geladen...</p>
        </div>
      </div>
    );
  }

  if (error || !artikel) {
    return (
      <div className="blog-detail-container">
        <div className="error-state">
          <h2>😞 Artikel nicht gefunden</h2>
          <p>{error || 'Der gewünschte Artikel existiert nicht.'}</p>
          <Link to="/blog" className="back-to-blog-btn">
            ← Zurück zum Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-container">
      {/* Zurück-Navigation */}
      <div className="breadcrumb">
        <Link to="/blog" className="breadcrumb-link">
          ← Zurück zum Blog
        </Link>
      </div>

      <article className="artikel-detail">
        {/* Cover-Bild */}
        {artikel.cover && (
          <div className="artikel-hero">
            <img 
              src={getBildUrl(artikel.cover.url)}
              alt={artikel.cover.alternativeText || artikel.title}
              className="hero-image"
            />
          </div>
        )}

        {/* Artikel-Header */}
        <header className="artikel-header">
          {/* Kategorie Badge */}
          {artikel.category && (
            <span className="kategorie-badge large">
              {artikel.category.name}
            </span>
          )}

          <h1 className="artikel-titel">{artikel.title}</h1>
          
          {/* Artikel Meta-Informationen */}
          <div className="artikel-meta">
            <span className="publish-datum">
              Veröffentlicht am {' '}
              {new Date(artikel.publishedAt || artikel.createdAt).toLocaleDateString('de-DE', {
                year: 'numeric',
                month: 'long', 
                day: 'numeric'
              })}
            </span>
            
            {/* Update-Datum nur wenn anders als Created-Datum */}
            {artikel.updatedAt !== artikel.createdAt && (
              <span className="update-datum">
                • Aktualisiert am {' '}
                {new Date(artikel.updatedAt).toLocaleDateString('de-DE')}
              </span>
            )}
          </div>

          {/* Artikel-Beschreibung */}
          {artikel.description && (
            <p className="artikel-lead">
              {artikel.description}
            </p>
          )}
        </header>

        {/* Artikel-Inhalt */}
        <div className="artikel-body">
          <div 
            className="artikel-content"
            // dangerouslySetInnerHTML rendert HTML aus Strapi Rich Text Editor
            dangerouslySetInnerHTML={{ __html: artikel.content }}
          />
        </div>

        {/* Artikel-Footer */}
        <footer className="artikel-footer-section">
          <div className="article-actions">
            <Link to="/blog" className="back-to-blog-btn secondary">
              ← Alle Artikel anzeigen
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default BlogDetail;