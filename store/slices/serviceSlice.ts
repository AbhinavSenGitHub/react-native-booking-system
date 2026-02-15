import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

interface ServiceState {
    services: any[];
    doctors: any[];
    loading: boolean;
    error: string | null;
}

const initialState: ServiceState = {
    services: [],
    doctors: [],
    loading: false,
    error: null,
};

export const fetchServices = createAsyncThunk('services/fetchServices', async (_, { rejectWithValue }) => {
    try {
        const { data } = await apiClient.get('/services');
        return data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
    }
});

export const fetchDoctors = createAsyncThunk('services/fetchDoctors', async (_, { rejectWithValue }) => {
    try {
        const { data } = await apiClient.get('/users/doctors');
        return data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch doctors');
    }
});

const serviceSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchServices.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.loading = false;
                state.services = action.payload;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchDoctors.fulfilled, (state, action) => {
                state.doctors = action.payload;
            });
    },
});

export default serviceSlice.reducer;
