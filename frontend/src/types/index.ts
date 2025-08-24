export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  preferences: {
    defaultCategory?: string;
    defaultStyle?: string;
    theme?: 'light' | 'dark';
  };
  created_at: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  preferences: {
    defaultCategory?: string;
    defaultStyle?: string;
  };
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface Prompt {
  id: number;
  title: string;
  input_text: string;
  category: PromptCategory;
  response_style: ResponseStyle;
  description?: string;
  generated_prompt: string;
  ai_response?: string;
  user: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePromptData {
  title: string;
  input_text: string;
  category: PromptCategory;
  response_style: ResponseStyle;
  description?: string;
  ai_response?: string;
}

export interface ExecutePromptData {
  prompt_id?: number;
  input_text: string;
  category: PromptCategory;
  response_style: ResponseStyle;
  description?: string;
}

export type PromptCategory = 
  | 'doubt'
  | 'image_generation'
  | 'learning_roadmap'
  | 'video_generation'
  | 'deep_research'
  | 'idea_exploration';

export type ResponseStyle = 
  | 'concise'
  | 'detailed'
  | 'creative'
  | 'formal'
  | 'technical';

export interface PromptCategoryOption {
  value: PromptCategory;
  label: string;
  description: string;
  icon: string;
  color: string;
}

export interface ResponseStyleOption {
  value: ResponseStyle;
  label: string;
  description: string;
  icon: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface DashboardStats {
  totalPrompts: number;
  totalExecutions: number;
  favoriteCategory: string;
  recentActivity: Prompt[];
}
