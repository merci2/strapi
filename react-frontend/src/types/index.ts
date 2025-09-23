// src/types/index.ts
// TypeScript Definitionen für Strapi Blog App - Best Practice Version

// ========================================
// HELPER TYPES
// ========================================

// Basis-Typ für alle Strapi Entities
interface StrapiBaseEntity {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  locale?: string;
}

// Bild-Format Definition für responsive Images
export interface ImageFormat {
  url: string;
  width: number;
  height: number;
  size: number;
  ext: string;
  mime: string;
}

// Media/Bild-Entity von Strapi
export interface StrapiMedia extends StrapiBaseEntity {
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
    // Dynamische Formate für Zukunftssicherheit
    [key: string]: ImageFormat | undefined;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: Record<string, unknown>;
  folderPath: string;
}

// ========================================
// CONTENT TYPES
// ========================================

// Kategorie-Entity (aus Strapi Sample Data)
export interface StrapiCategory extends StrapiBaseEntity {
  name: string;
  slug: string;
  description?: string;
}

// Haupt-Artikel-Entity (Sample Data Structure)
export interface StrapiArticle extends StrapiBaseEntity {
  // Basis-Felder aus Strapi Sample Data
  title: string;                    // Titel des Artikels
  description: string;              // Kurze Beschreibung/Excerpt
  content: string;                  // Vollständiger Rich-Text Inhalt
  slug: string;                     // URL-Slug für SEO

  // Relations
  cover?: StrapiMedia;              // Cover-Bild (populated)
  category?: StrapiCategory;        // Kategorie (populated)
  
  // SEO & Meta (falls erweitert)
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    canonicalURL?: string;
  };

  // Autor-Info (falls erweitert)
  author?: {
    id: number;
    name: string;
    email?: string;
    avatar?: StrapiMedia;
  };

  // Status & Visibility
  featured?: boolean;               // Hervorgehobener Artikel
  readingTime?: number;             // Geschätzte Lesezeit in Minuten
}

// ========================================
// API RESPONSE TYPES
// ========================================

// Standard Strapi API Response Wrapper
export interface StrapiResponse<T> {
  data: T;
  meta: StrapiMeta;
}

// Pagination & Meta-Informationen
export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

// API Error Response
export interface StrapiError {
  status: number;
  name: string;
  message: string;
  details?: Record<string, unknown>;
}

// ========================================
// FRONTEND SPECIFIC TYPES
// ========================================

// Loading States für UI Components
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Filter & Search Parameter
export interface BlogFilters {
  category?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// Navigation Route Definition
export interface NavRoute {
  path: string;
  label: string;
  icon?: string;
  external?: boolean;
}

// ========================================
// UTILITY TYPES
// ========================================

// Hilfsfunktion für API Calls
export type ApiCallResult<T> = {
  data?: T;
  error?: string;
  loading: boolean;
};

// Partial Update für Artikel (falls CMS-Integration erweitert wird)
export type ArticleUpdate = Partial<Pick<StrapiArticle, 'title' | 'description' | 'content' | 'featured'>>;

// ========================================
// TYPE GUARDS (für Runtime Type Checking)
// ========================================

// Prüfe ob Objekt ein StrapiArticle ist
export function isStrapiArticle(obj: unknown): obj is StrapiArticle {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'documentId' in obj &&
    'title' in obj &&
    'content' in obj
  );
}

// Prüfe ob Media-Objekt vollständig ist
export function isStrapiMedia(obj: unknown): obj is StrapiMedia {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'url' in obj &&
    'formats' in obj
  );
}

// ========================================
// CONSTANTS & ENUMS
// ========================================

// Unterstützte Bild-Formate
export const SUPPORTED_IMAGE_FORMATS = ['jpeg', 'jpg', 'png', 'webp', 'svg'] as const;
export type SupportedImageFormat = typeof SUPPORTED_IMAGE_FORMATS[number];

// Standard Pagination Limits
export const PAGINATION_LIMITS = {
  ARTICLES_PER_PAGE: 12,
  SEARCH_RESULTS_PER_PAGE: 8,
  FEATURED_ARTICLES: 6,
} as const;

// API Endpoints (für bessere Typisierung)
export const API_ENDPOINTS = {
  ARTICLES: '/api/articles',
  CATEGORIES: '/api/categories',
  MEDIA: '/api/upload/files',
} as const;

// ========================================
// EXPORT GROUPED TYPES
// ========================================

// Alle Content-Types
export type ContentType = StrapiArticle | StrapiCategory | StrapiMedia;

// Alle Response-Types  
export type ApiResponse<T = unknown> = StrapiResponse<T> | StrapiError;

// Alle Entity-Types
export type StrapiEntity = StrapiArticle | StrapiCategory | StrapiMedia;