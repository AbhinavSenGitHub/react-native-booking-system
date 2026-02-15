import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../api/client';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'Doctor' | 'Patient';
    token?: string;
    specialization?: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: true,
    error: null,
};

export const loadUser = createAsyncThunk('auth/loadUser', async () => {
    try {
        const storedUser = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('token');
        if (storedUser && token) {
            const user = JSON.parse(storedUser);
            // Ensure token is attached to user object in state
            return { ...user, token };
        }
    } catch (e) {
        console.error('Failed to load user', e);
    }
    return null;
});

export const login = createAsyncThunk('auth/login', async (credentials: any, { rejectWithValue }) => {
    try {
        const { data } = await apiClient.post('/auth/login', credentials);
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data));
        return data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
});

export const register = createAsyncThunk('auth/register', async (userData: any, { rejectWithValue }) => {
    try {
        const { data } = await apiClient.post('/auth/register', userData);
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data));
        return data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
});

export const logout = createAsyncThunk('auth/logout', async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    return null;
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData: { name: string }, { rejectWithValue }) => {
    try {
        const { data } = await apiClient.put('/auth/me', userData);

        // Merge with existing stored user data to avoid losing token or other info
        const storedUser = await AsyncStorage.getItem('user');
        const parsedStored = storedUser ? JSON.parse(storedUser) : {};
        const updatedUser = { ...parsedStored, ...data };

        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.user = action.payload;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = { ...state.user, ...action.payload };
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export default authSlice.reducer;
