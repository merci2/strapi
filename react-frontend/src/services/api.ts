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
export const getArtikelById = async (documentId: string): Promise<StrapiArticle> => {
  try {
    console.log('🔍 Lade Artikel:', documentId);
    console.log('🔗 URL:', `${API_URL}/api/articles/${documentId}?populate=*`);
    
    // Fetch einzelnen Artikel mit allen Relations (populate=*)
    const response = await fetch(`${API_URL}/api/articles/${documentId}?populate=*`, {
      method: 'GET',
      headers,
    });

    // Verwende verbesserte Error-Handling Funktion
    const result: StrapiResponse<StrapiArticle> = await handleApiResponse(response);
    
    console.log('✅ Artikel Detail geladen:', result.data);
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
    
    const response = await fetch(`${API_URL}/api/articles`, {
      method: 'GET',
      headers,
    });
    
    const result = await handleApiResponse(response);
    
    return {
      success: true,
      message: `Verbindung erfolgreich! ${result.data?.length || 0} Artikel gefunden.`
    };
    
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unbekannter Fehler'
    };
  }
};