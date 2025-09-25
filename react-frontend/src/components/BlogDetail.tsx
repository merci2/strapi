// src/components/BlogDetail.tsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { StrapiArticle, StrapiBlock, StrapiMedia } from '../types';
import { getArtikelById, getBildUrl } from '../services/api';
import '../styles/blogdetail.css'; 

// Component für Block-Rendering
const BlockRenderer: React.FC<{ blocks: StrapiBlock[] }> = ({ blocks }) => {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="no-content">
        <p>Kein Inhalt verfügbar.</p>
      </div>
    );
  }

  return (
    <div className="blocks-container">
      {blocks.map((block, index) => {
        switch (block.__component) {
          case 'shared.rich-text':
            return (
              <div key={index} className="block-rich-text">
                <div
                  className="rich-text-content"
                  dangerouslySetInnerHTML={{ __html: block.body }}
                />
              </div>
            );

          case 'shared.quote':
            return (
              <blockquote key={index} className="block-quote">
                <p>"{block.body}"</p>
                {block.author && (
                  <cite>— {block.author}</cite>
                )}
              </blockquote>
            );

          case 'shared.media':
            return (
              <div key={index} className="block-media">
                {block.file && (
                  <img
                    src={getBildUrl(block.file.url)}
                    alt={block.file.alternativeText || 'Media content'}
                    className="block-image"
                  />
                )}
              </div>
            );

          case 'shared.slider':
            return (
              <div key={index} className="block-slider">
                {block.files && block.files.length > 0 && (
                  <div className="slider-container">
                    {block.files.map((file: StrapiMedia, fileIndex: number) => (
                      <img
                        key={fileIndex}
                        src={getBildUrl(file.url)}
                        alt={file.alternativeText || `Slide ${fileIndex + 1}`}
                        className="slider-image"
                      />
                    ))}
                  </div>
                )}
              </div>
            );

          default: {
            const unknownComponent = typeof block === 'object' && block && '__component' in block 
              ? (block as { __component: string }).__component 
              : 'unknown';
            console.warn('Unknown block type:', unknownComponent);
            return (
              <div key={index} className="block-unknown">
                <p>Unbekannter Inhaltstyp: {unknownComponent}</p>
              </div>
            );
          }
        }
      })}
    </div>
  );
};

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
        console.log('🔍 Loading article with ID:', id);
        
        const apiUrl = `http://localhost:1337/api/articles/${id}?populate=*`;
        console.log('📍 Full API URL being called:', apiUrl);
        
        // Direkter fetch statt getArtikelById
        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 7340d507d3da17bf3bc77f252757719019fce4466ed3c168f97f4c503a06d394a62c9e91fcc5f9c365f527543e408b0fec38b70d12a6c0f67dc15632c8d8b5cb49e4f140ae48b29b66dab39cfa4afc5a7da0d97853d87e57ece1b2b54db25c567dbeaa2f8c2361b2fd135970ebfb40a99d96f85c03a94341c0d120908029758f'
          }
        });
        
        console.log('📊 Response Status:', response.status);
        console.log('📋 Content-Type:', response.headers.get('content-type'));
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('✅ Article loaded:', result);
        
        setArtikel(result.data);
        setError(null);
      } catch (err) {
        console.error('❌ Error loading article:', err);
        setError(err instanceof Error ? err.message : 'Artikel konnte nicht geladen werden');
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

        {/* Artikel-Inhalt - Jetzt mit Blocks statt content */}
        <div className="artikel-body">
          {artikel.blocks && artikel.blocks.length > 0 ? (
            <BlockRenderer blocks={artikel.blocks} />
          ) : (
            <div className="no-content">
              <p>Kein Inhalt verfügbar für diesen Artikel.</p>
            </div>
          )}
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