import apiClient from './Apiclient';
import type { HorsesResponse, IHorse, CreateHorsePayload } from '../types/horse';

export const fetchHorses = async (): Promise<HorsesResponse> => {
  const response = await apiClient.get<HorsesResponse>('/horses');
  return response.data;
};

export const fetchHorseById = async (id: string): Promise<IHorse> => {
  const response = await apiClient.get<IHorse>(`/horses/${id}`);
  return response.data;
};

export const createHorse = async (payload: CreateHorsePayload): Promise<IHorse> => {
  const response = await apiClient.post<IHorse>('/horses', payload);
  return response.data;
};

export const updateHorse = async (id: string, payload: Partial<CreateHorsePayload>): Promise<IHorse> => {
  const response = await apiClient.patch<IHorse>(`/horses/${id}`, payload);
  return response.data;
};

export const deleteHorse = async (id: string): Promise<void> => {
  await apiClient.delete(`/horses/${id}`);
};