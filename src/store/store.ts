import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import horsesReducer from './horsesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    horses: horsesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;