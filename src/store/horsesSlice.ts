import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchHorses } from '../services/horseService';
import type { IHorse } from '../types/horse';

interface HorsesState {
  horses: IHorse[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: HorsesState = {
  horses: [],
  total: 0,
  loading: false,
  error: null,
};

// Thunk — charge tous les chevaux depuis l'API
export const loadHorses = createAsyncThunk(
  'horses/loadAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchHorses();
    } catch {
      return rejectWithValue('Impossible de charger les chevaux.');
    }
  }
);

const horsesSlice = createSlice({
  name: 'horses',
  initialState,
  reducers: {
    clearHorses: (state) => {
      state.horses = [];
      state.total = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadHorses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadHorses.fulfilled, (state, action) => {
        state.loading = false;
        state.horses = action.payload.horses;
        state.total = action.payload.total;
      })
      .addCase(loadHorses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearHorses } = horsesSlice.actions;
export default horsesSlice.reducer;