export type HorseSex = 'Mâle' | 'Femelle' | 'Hongre';
export type HorseStep = 'Naissance' | 'Croissance' | 'Entraînement' | 'Compétition' | 'BLUP 100';

export interface IRace {
  _id: string;
  name: string;
  isPureBreed: boolean;
}

export interface IHorse {
  _id: string;
  name: string;
  sex: HorseSex;
  race: IRace;
  step: HorseStep;
  blup: number;
  owner: string;
  createdAt: string;
  updatedAt: string;
  age: string;
}

export interface HorsesResponse {
  total: number;
  horses: IHorse[];
}

export interface CreateHorsePayload {
  name: string;
  sex: HorseSex;
  raceId: string;
  step?: HorseStep;
  blup?: number;
  age? : string;
}