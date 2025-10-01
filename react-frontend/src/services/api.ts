// src/services/api.ts
// ========================================
// API SERVICE with Environment Variable Fallbacks
// ========================================

import type { StrapiArticle, StrapiResponse } from '../types';

// Basis-Konfiguration mit Fallbacks
const API_URL = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';
const API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN_FULL_ACCESS || '7340d507d3da17bf3bc77f252757719019fce4466ed3c168f97f4c503a06d394a62c9e91fcc5f9c365f527543e408b0fec38b70d12a6c0f67dc15632c8d8b5cb49e4f140ae48b29b66dab39cfa4afc5a7da0d97853d87e57ece1b2b54db25c567dbeaa2f8c2361b2fd135970ebfb40a99d96f85c03a94341c0d120908029758f';

// Debug: Environment Variables
console.log('🔧 API Configuration:', {
  API_URL: API_URL,
  API_TOKEN_EXISTS: !!API_TOKEN,
  ENV_API_URL: import.meta.env.VITE_STRAPI_API_URL,
  ENV_TOKEN_EXISTS: !!import.meta.env.VITE_STRAPI_API_TOKEN_FULL_ACCESS
});

// Standard-Headers für alle Requests
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_TOKEN}`,
};

// Verbesserte Error-Handling Funktion mit detailliertem Debugging
const handleApiResponse = async (response: Response) => {
  console.log('🔍 Response Details:', {
    status: response.status,
    statusText: response.statusText,
    contentType: response.headers.get('content-type'),
    url: response.url
  });

  // Prüfe zuerst den HTTP Status
  if (!response.ok) {
    const statusText = response.statusText || 'Unknown Error';
    
    // Hole Response Body für Debugging
    const responseText = await response.text();
    console.log('❌ Error Response Body (first 500 chars):', responseText.substring(0, 500));
    
    // Versuche JSON zu parsen, falls vorhanden
    let errorMessage = `HTTP ${response.status}: ${statusText}`;
    
    try {
      const errorData = JSON.parse(responseText);
      if (errorData.error?.message) {
        errorMessage = errorData.error.message;
      }
    } catch {
      // Falls kein JSON, gib ersten Teil der HTML-Response aus
      if (responseText.includes('<html') || responseText.includes('<!DOCTYPE')) {
        errorMessage = `HTTP ${response.status}: Server returned HTML instead of JSON (likely 404 page)`;
      } else {
        errorMessage = `HTTP ${response.status}: ${statusText}`;
      }
    }
    
    throw new Error(errorMessage);
  }

  // Prüfe Content-Type Header
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    // Hole Response Body für Debugging
    const responseText = await response.text();
    console.log('❌ Non-JSON Response Body (first 500 chars):', responseText.substring(0, 500));
    
    throw new Error(`Server returned non-JSON response (Content-Type: ${contentType}). Check if Strapi is running correctly.`);
  }

  // Versuche JSON zu parsen
  try {
    return await response.json();
  } catch {
    throw new Error('Invalid JSON response from server');
  }
};

// Holt alle Artikel aus Strapi
export const getAlleArtikel = async (): Promise<StrapiArticle[]> => {
  try {
    console.log('🔍 Lade Artikel von:', `${API_URL}/api/articles`);
    console.log('🔑 Mit Token:', API_TOKEN ? 'Token vorhanden' : 'Kein Token');
    
    // Fetch-Aufruf zu Strapi API (articles aus Sample Data)
    const response = await fetch(`${API_URL}/api/articles?populate=*`, {
      method: 'GET',
      headers,
    });

    // Verwende verbesserte Error-Handling Funktion
    const result: StrapiResponse<StrapiArticle[]> = await handleApiResponse(response);
    
    console.log('✅ Artikel geladen:', result.data);
    return result.data;
    
  } catch (error) {
    console.error('❌ Fehler beim Laden der Artikel:', error);
    
    // Detaillierte Fehlermeldung je nach Typ
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Verbindung zu Strapi fehlgeschlagen. Ist der Server unter ' + API_URL + ' erreichbar?');
    }
    
    throw error;
  }
};

// Holt einen einzelnen Artikel anhand der documentId
// KRITISCH: Strapi v5 braucht explizite Population für Dynamic Zones (blocks)
export const getArtikelById = async (documentId: string): Promise<StrapiArticle> => {
  try {
    console.log('🔍 Lade Artikel:', documentId);
    
    // STRAPI v5 FIX: Korrekte Syntax für populate
    // Wichtig: Keine verschachtelten [populate] bei einfachen Relations!
    const url = `${API_URL}/api/articles/${documentId}?populate[blocks][populate]=*&populate[cover]=*&populate[category]=*&populate[author][populate][avatar]=*`;
    
    console.log('🔗 Full URL:', url);
    
    // Fetch einzelnen Artikel mit expliziter blocks Population
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    // Verwende verbesserte Error-Handling Funktion
    const result: StrapiResponse<StrapiArticle> = await handleApiResponse(response);
    
    console.log('✅ Artikel Detail geladen:', result.data);
    console.log('📦 Blocks:', result.data.blocks);
    
    // Debug: Zeige blocks Struktur im Detail
    if (result.data.blocks && result.data.blocks.length > 0) {
      result.data.blocks.forEach((block, index) => {
        console.log(`📄 Block ${index} (${block.__component}):`, block);
        if (block.__component === 'shared.rich-text') {
          console.log(`   └─ body type:`, typeof block.body);
          console.log(`   └─ body content:`, block.body);
        }
      });
    } else {
      console.warn('⚠️ Keine Blocks gefunden! Artikel hat möglicherweise keinen Inhalt.');
    }
    
    return result.data;
    
  } catch (error) {
    console.error('❌ Fehler beim Laden des Artikels:', error);
    
    // Spezielle Behandlung für 404-Fehler
    if (error instanceof Error && error.message.includes('404')) {
      throw new Error(`Artikel mit ID "${documentId}" wurde nicht gefunden`);
    }
    
    // Verbindungsfehler
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Verbindung zu Strapi fehlgeschlagen. Ist der Server erreichbar?');
    }
    
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

// Debug-Funktion für Tests
export const testApiConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('🧪 Teste API-Verbindung...');
    console.log('📍 API_URL:', API_URL);
    console.log('🔐 Token verfügbar:', !!API_TOKEN);
    
    const response = await fetch(`${API_URL}/api/articles?pagination[limit]=1`, {
      method: 'GET',
      headers,
    });

    const result = await handleApiResponse(response);
    
    return {
      success: true,
      message: `✅ Verbindung erfolgreich! ${result.data?.length || 0} Artikel gefunden.`
    };
    
  } catch (error) {
    return {
      success: false,
      message: `❌ Verbindungsfehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`
    };
  }
};