import axios from 'axios';

const API_BASE_URL = '/api';

export interface GenerationParams {
  prompt: string;
  model: string;
  num_images: number;
  aspect_ratio: string;
  time_elapsed: number;
  image_url?: string;
}

export interface GenerationResponse {
  success: boolean;
  image_urls?: string[];
  seeds_used?: number[];
  error?: string;
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes timeout for image generation
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    return Promise.reject(error);
  }
);

export const generateImages = async (params: GenerationParams): Promise<GenerationResponse> => {
  try {
    const response = await apiClient.post('/generate', params);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const uploadImage = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const getModels = async (): Promise<{ models: any[]; error?: string }> => {
  try {
    const response = await apiClient.get('/models');
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const getGallery = async (page = 1, limit = 20): Promise<{ images: any[]; total: number; error?: string }> => {
  try {
    const response = await apiClient.get(`/gallery?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

export default apiClient;