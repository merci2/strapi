// src/pages/Blog.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface StrapiArticle {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface ApiResponse {
  data: StrapiArticle[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

const Blog: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:1337/api/articles?populate=*', {
          headers: {
            'Authorization': 'Bearer 7340d507d3da17bf3bc77f252757719019fce4466ed3c168f97f4c503a06d394a62c9e91fcc5f9c365f527543e408b0fec38b70d12a6c0f67dc15632c8d8b5cb49e4f140ae48b29b66dab39cfa4afc5a7da0d97853d87e57ece1b2b54db25c567dbeaa2f8c2361b2fd135970ebfb40a99d96f85c03a94341c0d120908029758f'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json() as ApiResponse;
        console.log('Blog API Response:', result);
        setData(result);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error('Blog API Error:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

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

  if (error) {
    return (
      <div className="blog-container">
        <div className="error">Fehler: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="retry-btn"
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="blog-container">
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
      </div>
    );
  }

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>Strapi Blog</h1>
        <p className="blog-subtitle">
          Entdecke interessante Artikel und Geschichten ({data.data.length} Artikel)
        </p>
      </div>

      <div className="artikel-grid">
        {data.data.map((article) => (
          <article 
            key={article.documentId}
            className="artikel-karte"
          >
            <div className="artikel-content">
              <h2 className="artikel-titel">
                <Link to={`/blog/${article.documentId}`}>
                  {article.title}
                </Link>
              </h2>

              <p className="artikel-beschreibung">
                {article.description}
              </p>

              <div className="artikel-footer">
                <span className="artikel-datum">
                  {new Date(article.publishedAt || article.createdAt).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                
                <Link 
                  to={`/blog/${article.documentId}`}
                  className="weiterlesen-link"
                >
                  Weiterlesen →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;