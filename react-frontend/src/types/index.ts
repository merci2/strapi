// src/types/index.ts
// TypeScript Definitionen für Strapi Blog App - Updated with Blocks

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
// BLOCKS/COMPONENTS TYPES
// ========================================

// Basis-Interface für alle Block-Komponenten
interface StrapiBlockBase {
  __component: string;
  id: number;
}

// Rich Text Block
export interface StrapiRichTextBlock extends StrapiBlockBase {
  __component: 'shared.rich-text';
  body: string; // HTML content
}

// Quote Block
export interface StrapiQuoteBlock extends StrapiBlockBase {
  __component: 'shared.quote';
  body: string;
  author?: string;
}

// Media Block
export interface StrapiMediaBlock extends StrapiBlockBase {
  __component: 'shared.media';
  file: StrapiMedia;
}

// Slider Block
export interface StrapiSliderBlock extends StrapiBlockBase {
  __component: 'shared.slider';
  files: StrapiMedia[];
}

// Union Type für alle Block-Typen
export type StrapiBlock = 
  | StrapiRichTextBlock 
  | StrapiQuoteBlock 
  | StrapiMediaBlock 
  | StrapiSliderBlock;

// ========================================
// CONTENT TYPES
// ========================================

// Kategorie-Entity (aus Strapi Sample Data)
export interface StrapiCategory extends StrapiBaseEntity {
  name: string;
  slug: string;
  description?: string;
}

// Author Entity
export interface StrapiAuthor extends StrapiBaseEntity {
  name: string;
  email?: string;
  avatar?: StrapiMedia;
}

// Haupt-Artikel-Entity (Updated with blocks)
export interface StrapiArticle extends StrapiBaseEntity {
  // Basis-Felder aus Strapi Schema (REQUIRED)
  title: string;                    // Titel des Artikels
  description: string;              // Kurze Beschreibung/Excerpt
  slug: string;                     // URL-Slug für SEO

  // Content als Dynamic Zone (blocks)
  blocks?: StrapiBlock[];           // Dynamic Zone mit verschiedenen Block-Typen

  // Optional fields - nur wenn populated
  cover?: StrapiMedia;              // Cover-Bild (populated)
  category?: StrapiCategory;        // Kategorie (populated)
  author?: StrapiAuthor;            // Autor (populated)

  // Legacy content field (falls noch verwendet)
  content?: string;                 // Fallback für alte Rich-Text Implementierung
  
  // SEO & Meta (falls erweitert)
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    canonicalURL?: string;
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
// QUERY & FILTER TYPES
// ========================================

// Filter-Optionen für Artikel-Abfragen
export interface ArtikelFilter {
  category?: string;
  author?: string;
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
export type ArticleUpdate = Partial<Pick<StrapiArticle, 'title' | 'description' | 'blocks' | 'featured'>>;

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
    'description' in obj
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

// Prüfe Block-Typ
export function isStrapiBlock(obj: unknown): obj is StrapiBlock {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    '__component' in obj &&
    'id' in obj
  );
}

// ========================================
// CONSTANTS & ENUMS
// ========================================

// Unterstützte Bild-Formate
export const SUPPORTED_IMAGE_FORMATS = ['jpeg', 'jpg', 'png', 'webp', 'svg'] as const;
export type SupportedImageFormat = typeof SUPPORTED_IMAGE_FORMATS[number];

// Unterstützte Block-Komponenten
export const SUPPORTED_BLOCK_COMPONENTS = [
  'shared.rich-text',
  'shared.quote',
  'shared.media', 
  'shared.slider'
] as const;
export type SupportedBlockComponent = typeof SUPPORTED_BLOCK_COMPONENTS[number];

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