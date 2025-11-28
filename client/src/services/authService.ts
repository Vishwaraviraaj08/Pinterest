import api from '../utils/api';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  PasswordResetRequest,
  UserResponse,
  OtpRequest,
  OtpVerificationRequest
} from '../types';

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

  getProfile: async (userId: number): Promise<UserResponse> => {
    const response = await api.get<UserResponse>(`/auth/profile/${userId}`);
    return response.data;
  },

  updateProfile: async (userId: number, data: Partial<UserResponse>): Promise<UserResponse> => {
    const response = await api.put<UserResponse>(`/auth/profile/${userId}`, data);
    return response.data;
  },

  generateOtp: async (data: OtpRequest): Promise<{ message: string; otp: string }> => {
    const response = await api.post<{ message: string; otp: string }>('/auth/otp/generate', data);
    return response.data;
  },

  verifyOtp: async (data: OtpVerificationRequest): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/otp/verify', data);
    return response.data;
  },

  searchUsers: async (keyword: string): Promise<UserResponse[]> => {
    const response = await api.get<UserResponse[]>(`/auth/search?keyword=${keyword}`);
    return response.data;
  },

  getUsersByIds: async (userIds: number[]): Promise<UserResponse[]> => {
    const response = await api.post<UserResponse[]>('/auth/users/batch', userIds);
    return response.data;
  },
};




