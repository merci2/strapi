// 2. API SERVICE - src/services/api.ts
// ========================================

import type { StrapiArticle, StrapiResponse } from '../types';

// Basis-Konfiguration für alle API-Aufrufe
const API_URL = import.meta.env.VITE_STRAPI_API_URL;
const API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN_FULL_ACCESS;

// Standard-Headers für alle Requests
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_TOKEN}`,
};



// Holt alle Artikel aus Strapi
export const getAlleArtikel = async (): Promise<StrapiArticle[]> => {
  try {
    console.log('🔍 Lade Artikel von:', `${API_URL}/api/articles`);
    
    // Fetch-Aufruf zu Strapi API (articles aus Sample Data)
    const response = await fetch(`${API_URL}/api/articles?populate=*`, {
      method: 'GET',
      headers,
    });

    // Prüfe ob Request erfolgreich war
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse JSON Response
    const result: StrapiResponse<StrapiArticle[]> = await response.json();
    console.log('✅ Artikel geladen:', result.data);
    return result.data;
    
  } catch (error) {
    console.error('❌ Fehler beim Laden der Artikel:', error);
    throw error;
  }
};

// Holt einen einzelnen Artikel anhand der documentId
export const getArtikelById = async (documentId: string): Promise<StrapiArticle> => {
  try {
    console.log('🔍 Lade Artikel:', documentId);
    
    // Fetch einzelnen Artikel mit allen Relations (populate=*)
    const response = await fetch(`${API_URL}/api/articles/${documentId}?populate=*`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse JSON und gib nur die data zurück
    const result: StrapiResponse<StrapiArticle> = await response.json();
    console.log('✅ Artikel Detail geladen:', result.data);
    return result.data;
    
  } catch (error) {
    console.error('❌ Fehler beim Laden des Artikels:', error);
    throw error;
  }
};

// Hilfsfunktion um Bild-URLs zu komplettieren
export const getBildUrl = (url: string): string => {
  // Wenn URL bereits vollständig ist, gib sie zurück
  if (url.startsWith('http')) {
    return url;
  }
  // Sonst füge Strapi Base-URL hinzu
  return `${API_URL}${url}`;
};