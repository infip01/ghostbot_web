export interface GenerationParams {
  prompt: string;
  model: string;
  num_images: number;
  aspect_ratio: string;
  time_elapsed: number;
  image_url?: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  seed: number;
  model: string;
  prompt: string;
  created_at?: string;
  liked?: boolean;
}

export interface Model {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  badge?: {
    text: string;
    color: string;
  };
  features: string[];
  limitations?: string[];
  speed: 1 | 2 | 3 | 4 | 5;
  quality: 1 | 2 | 3 | 4 | 5;
  maxImages?: number;
  supportedAspectRatios?: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GenerationResponse extends ApiResponse {
  image_urls?: string[];
  seeds_used?: number[];
}

export interface UploadResponse extends ApiResponse {
  url?: string;
}

export interface GalleryResponse extends ApiResponse {
  images?: GeneratedImage[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface Theme {
  mode: 'light' | 'dark';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  autoSave: boolean;
  notifications: boolean;
  defaultModel: string;
  defaultAspectRatio: string;
  defaultNumImages: number;
}

export type AspectRatio = 
  | 'IMAGE_ASPECT_RATIO_SQUARE' 
  | 'IMAGE_ASPECT_RATIO_LANDSCAPE' 
  | 'IMAGE_ASPECT_RATIO_PORTRAIT';

export type ModelId = 
  | 'img3' 
  | 'img4' 
  | 'uncen' 
  | 'kontext-max' 
  | 'kontext-pro' 
  | 'flux-1-1-pro' 
  | 'flux-dev' 
  | 'flux-pro' 
  | 'flux-schnell';