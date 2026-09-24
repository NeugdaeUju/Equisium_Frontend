import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from '../types/auth.ts';

const TOKEN_KEY = 'equisium_token';
const USER_ID_KEY = 'equisium_user_id';

const storedToken = localStorage.getItem(TOKEN_KEY);
const storedUserId = localStorage.getItem(USER_ID_KEY);

const initialState: AuthState = {
  token: storedToken,
  userId: storedUserId,
  isAuthenticated: Boolean(storedToken),
};

interface LoginSuccessPayload {
  token: string;
  userId: string;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<LoginSuccessPayload>) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.isAuthenticated = true;
      localStorage.setItem(TOKEN_KEY, action.payload.token);
      localStorage.setItem(USER_ID_KEY, action.payload.userId);
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.isAuthenticated = false;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_ID_KEY);
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;