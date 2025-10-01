// src/components/BlogDetail.tsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { StrapiArticle, StrapiBlock, StrapiMedia } from '../types';
import { getArtikelById, getBildUrl } from '../services/api';
import '../styles/blogdetail.css'; 

// Hilfsfunktion um Markdown/Strapi Rich Text zu rendern
const renderRichTextBody = (body: unknown): string => {
  // Falls body bereits ein String ist (HTML), direkt zurückgeben
  if (typeof body === 'string') {
    return body;
  }

  // Falls body ein Array ist (Strapi v5 Block-Text-Format)
  if (Array.isArray(body)) {
    return body.map(block => {
      if (block.type === 'paragraph') {
        const text = block.children?.map((child: { text?: string }) => child.text || '').join('') || '';
        return `<p>${text}</p>`;
      }
      if (block.type === 'heading') {
        const level = block.level || 2;
        const text = block.children?.map((child: { text?: string }) => child.text || '').join('') || '';
        return `<h${level}>${text}</h${level}>`;
      }
      if (block.type === 'list') {
        const listItems = block.children?.map((item: { children?: { text?: string }[] }) => {
          const text = item.children?.map(child => child.text || '').join('') || '';
          return `<li>${text}</li>`;
        }).join('') || '';
        
        const tag = block.format === 'ordered' ? 'ol' : 'ul';
        return `<${tag}>${listItems}</${tag}>`;
      }
      if (block.type === 'quote') {
        const text = block.children?.map((child: { text?: string }) => child.text || '').join('') || '';
        return `<blockquote>${text}</blockquote>`;
      }
      if (block.type === 'code') {
        const text = block.children?.map((child: { text?: string }) => child.text || '').join('') || '';
        return `<pre><code>${text}</code></pre>`;
      }
      return '';
    }).join('');
  }

  // Fallback: Leerer String wenn Format unbekannt
  console.warn('Unknown rich text body format:', body);
  return '';
};

// Component für Block-Rendering
const BlockRenderer: React.FC<{ blocks: StrapiBlock[] }> = ({ blocks }) => {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="no-content">
        <p>Kein Inhalt verfügbar.</p>
      </div>
    );
  }

  console.log('🔍 Rendering blocks:', blocks);

  return (
    <div className="blocks-container">
      {blocks.map((block, index) => {
        console.log(`Block ${index}:`, block);
        
        switch (block.__component) {
          case 'shared.rich-text': {
            const htmlContent = renderRichTextBody(block.body);
            console.log('Rich text HTML:', htmlContent);
            
            return (
              <div key={index} className="block-rich-text">
                <div
                  className="rich-text-content"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </div>
            );
          }

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
  const { id } = useParams<{ id: string }>();
  
  const [artikel, setArtikel] = useState<StrapiArticle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        const artikelData = await getArtikelById(id);
        console.log('✅ Article loaded:', artikelData);
        console.log('📦 Blocks:', artikelData.blocks);
        setArtikel(artikelData);
        setError(null);
      } catch (err) {
        console.error('❌ Error loading article:', err);
        setError(err instanceof Error ? err.message : 'Artikel konnte nicht geladen werden');
      } finally {
        setLoading(false);
      }
    };

    ladeArtikel();
  }, [id]);

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
      <div className="breadcrumb">
        <Link to="/blog" className="breadcrumb-link">
          ← Zurück zum Blog
        </Link>
      </div>

      <article className="artikel-detail">
        {artikel.cover && (
          <div className="artikel-hero">
            <img 
              src={getBildUrl(artikel.cover.url)}
              alt={artikel.cover.alternativeText || artikel.title}
              className="hero-image"
            />
          </div>
        )}

        <header className="artikel-header">
          {artikel.category && (
            <span className="kategorie-badge large">
              {artikel.category.name}
            </span>
          )}

          <h1 className="artikel-titel">{artikel.title}</h1>
          
          <div className="artikel-meta">
            <span className="publish-datum">
              Veröffentlicht am {' '}
              {new Date(artikel.publishedAt || artikel.createdAt).toLocaleDateString('de-DE', {
                year: 'numeric',
                month: 'long', 
                day: 'numeric'
              })}
            </span>
            
            {artikel.updatedAt !== artikel.createdAt && (
              <span className="update-datum">
                • Aktualisiert am {' '}
                {new Date(artikel.updatedAt).toLocaleDateString('de-DE')}
              </span>
            )}
          </div>

          {artikel.description && (
            <p className="artikel-lead">
              {artikel.description}
            </p>
          )}
        </header>

        <div className="artikel-body">
          {artikel.blocks && artikel.blocks.length > 0 ? (
            <BlockRenderer blocks={artikel.blocks} />
          ) : (
            <div className="no-content">
              <p>Kein Inhalt verfügbar für diesen Artikel.</p>
            </div>
          )}
        </div>

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