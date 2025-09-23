import React, { useEffect, useState } from 'react';

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

const SimpleTest: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/articles', {
          headers: {
            'Authorization': 'Bearer 7340d507d3da17bf3bc77f252757719019fce4466ed3c168f97f4c503a06d394a62c9e91fcc5f9c365f527543e408b0fec38b70d12a6c0f67dc15632c8d8b5cb49e4f140ae48b29b66dab39cfa4afc5a7da0d97853d87e57ece1b2b54db25c567dbeaa2f8c2361b2fd135970ebfb40a99d96f85c03a94341c0d120908029758f'
          }
        });
        
        const result = await response.json() as ApiResponse;
        console.log('Raw API Response:', result);
        setData(result);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error('Error:', err);
        setError(errorMessage);
      }
    };

    testAPI();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>API Test</h1>
      <h2>Articles ({data.data.length})</h2>
      {data.data.map(article => (
        <div key={article.documentId} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
          <h3>{article.title}</h3>
          <p>{article.description}</p>
          <small>ID: {article.documentId}</small>
        </div>
      ))}
      <details>
        <summary>Raw JSON</summary>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </details>
    </div>
  );
};

export default SimpleTest;