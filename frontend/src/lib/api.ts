import axios, { AxiosInstance, AxiosError } from 'axios';
import { 
  User, 
  AuthResponse, 
  LoginData, 
  RegisterData, 
  Prompt, 
  CreatePromptData, 
  ExecutePromptData,
  PaginatedResponse,
  ApiError,
  DashboardStats
} from '@/types';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          const newToken = response.data.access;
          localStorage.setItem('accessToken', newToken);
          
          // Retry the original request
          if (error.config) {
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return api.request(error.config);
          }
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/auth/login';
        }
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to handle API errors
const handleApiError = (error: AxiosError): never => {
  const apiError: ApiError = {
    message: 'An unexpected error occurred',
    status: error.response?.status || 500,
  };

  if (error.response?.data) {
    const data = error.response.data as any;
    if (data.detail) {
      apiError.message = data.detail;
    } else if (data.message) {
      apiError.message = data.message;
    } else if (data.non_field_errors) {
      apiError.message = data.non_field_errors[0];
    } else if (typeof data === 'object') {
      apiError.errors = data;
      apiError.message = 'Validation errors occurred';
    }
  }

  throw apiError;
};

// Auth API
export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login/', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      // Transform camelCase to snake_case for Django
      const transformedData = {
        username: data.username,
        email: data.email,
        password: data.password,
        confirm_password: data.confirmPassword, // Transform this field
        role: data.role,
        preferences: data.preferences,
      };
      const response = await api.post('/auth/register/', transformedData);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  googleAuth: async (idToken: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/google/', { id_token: idToken });
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  getProfile: async (): Promise<User> => {
    try {
      const response = await api.get('/auth/profile/');
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    try {
      const response = await api.patch('/auth/profile/', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },
};

// Prompts API
export const promptsApi = {
  getPrompts: async (page: number = 1): Promise<PaginatedResponse<Prompt>> => {
    try {
      const response = await api.get(`/prompts/?page=${page}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  getPrompt: async (id: number): Promise<Prompt> => {
    try {
      const response = await api.get(`/prompts/${id}/`);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  createPrompt: async (data: CreatePromptData): Promise<Prompt> => {
    try {
      const response = await api.post('/prompts/', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  updatePrompt: async (id: number, data: Partial<CreatePromptData>): Promise<Prompt> => {
    try {
      const response = await api.patch(`/prompts/${id}/`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  deletePrompt: async (id: number): Promise<void> => {
    try {
      await api.delete(`/prompts/${id}/`);
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  },

  executePrompt: async (data: ExecutePromptData): Promise<{ generated_prompt: string; response: string }> => {
    try {
      const response = await api.post('/prompts/execute/', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  dashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get('/prompts/dashboard-stats/');
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },
};

export default api;
