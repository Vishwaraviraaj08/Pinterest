import api from '../utils/api';

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  mobileNumber?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  username: string;
  userId: number;
  message: string;
}

export interface PasswordResetRequest {
  email: string;
  mobileNumber: string;
  newPassword: string;
}

export const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  resetPassword: async (data: PasswordResetRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/reset-password', data);
    return response.data;
  },

  getProfile: async (userId: number) => {
    const response = await api.get(`/auth/profile/${userId}`);
    return response.data;
  },

  updateProfile: async (userId: number, data: any) => {
    const response = await api.put(`/auth/profile/${userId}`, data);
    return response.data;
  },
};




