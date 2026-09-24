import apiClient from './apiClient.ts';
import type { LoginPayload, LoginResponse, SignupPayload, SignupResponse } from '../types/auth.ts';

export const signupRequest = async (payload: SignupPayload): Promise<SignupResponse> => {
  const response = await apiClient.post<SignupResponse>('/auth/signup', payload);
  return response.data;
};

export const loginRequest = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', payload);
  return response.data;
};