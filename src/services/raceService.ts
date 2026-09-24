import apiClient from './Apiclient';

export interface IRaceOption {
  _id: string;
  name: string;
  isPureBreed: boolean;
}

export const fetchRaces = async (): Promise<IRaceOption[]> => {
  const response = await apiClient.get<IRaceOption[]>('/races');
  return response.data;
};