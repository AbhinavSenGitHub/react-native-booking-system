import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your machine's IP address if testing on a physical device
// For Android Emulator, use http://10.0.2.2:5000
// For iOS Simulator, use http://localhost:5000
const BASE_URL = 'http://10.130.10.9:5000/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
