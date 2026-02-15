import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

export interface Appointment {
    _id: string;
    patient: any;
    doctor: any;
    service: any;
    date: string;
    timeSlot: string;
    status: 'Booked' | 'Accepted' | 'Rejected' | 'Completed';
    createdAt: string;
}

interface AppointmentState {
    myAppointments: Appointment[];
    doctorAppointments: Appointment[];
    loading: boolean;
    error: string | null;
}

const initialState: AppointmentState = {
    myAppointments: [],
    doctorAppointments: [],
    loading: false,
    error: null,
};

export const fetchAppointments = createAsyncThunk(
    'appointments/fetchAppointments',
    async (role: 'Doctor' | 'Patient', { rejectWithValue }) => {
        try {
            if (role === 'Doctor') {
                const [doctorRes, myRes] = await Promise.all([
                    apiClient.get('/appointments/doctor'),
                    apiClient.get('/appointments/my')
                ]);
                return { doctorAppointments: doctorRes.data, myAppointments: myRes.data };
            } else {
                const { data } = await apiClient.get('/appointments/my');
                return { myAppointments: data, doctorAppointments: [] };
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
        }
    }
);

export const bookAppointment = createAsyncThunk(
    'appointments/bookAppointment',
    async (bookingData: any, { dispatch, rejectWithValue }) => {
        try {
            await apiClient.post('/appointments', bookingData);
            return null;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Booking failed');
        }
    }
);

export const updateAppointmentStatus = createAsyncThunk(
    'appointments/updateStatus',
    async ({ id, status }: { id: string, status: string }, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.put(`/appointments/${id}/status`, { status });
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Update failed');
        }
    }
);

export const postReview = createAsyncThunk(
    'appointments/postReview',
    async (reviewData: { appointmentId: string, rating: number, comment: string }, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.post('/reviews', reviewData);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to post review');
        }
    }
);

export const rescheduleAppointment = createAsyncThunk(
    'appointments/reschedule',
    async ({ id, date, timeSlot }: { id: string, date: string, timeSlot: string }, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.put(`/appointments/${id}/timing`, { date, timeSlot });
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Reschedule failed');
        }
    }
);

const appointmentSlice = createSlice({
    name: 'appointments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAppointments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.myAppointments = action.payload.myAppointments;
                state.doctorAppointments = action.payload.doctorAppointments;
            })
            .addCase(fetchAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
                const docIdx = state.doctorAppointments.findIndex(a => a._id === action.payload._id);
                if (docIdx !== -1) {
                    state.doctorAppointments[docIdx] = action.payload;
                }
                const myIdx = state.myAppointments.findIndex(a => a._id === action.payload._id);
                if (myIdx !== -1) {
                    state.myAppointments[myIdx] = action.payload;
                }
            })
            .addCase(rescheduleAppointment.fulfilled, (state, action) => {
                const idx = state.myAppointments.findIndex(a => a._id === action.payload._id);
                if (idx !== -1) {
                    state.myAppointments[idx] = action.payload;
                }
            });
    },
});

export default appointmentSlice.reducer;
