import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import appointmentReducer from './slices/appointmentSlice';
import serviceReducer from './slices/serviceSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        appointments: appointmentReducer,
        services: serviceReducer,
        settings: settingsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
