import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ERROR_MESSAGES } from './apiEndPoints';
import { showErrorToast } from '../components/ToastMessage';

const apiClient = axios.create({
  baseURL: 'https://dev.softwareco.com/interview/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('bearerToken');
    console.log('token', token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export const getData = async (url: string) => {
  console.log('url----------', url);
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching data:', error);
    const statusCode = error?.response?.status;
    const errorMessage = ERROR_MESSAGES[statusCode] || ERROR_MESSAGES.DEFAULT;
    showErrorToast(errorMessage);
    throw error;
  }
};

export const postData = async (url: string, data: any) => {
  try {
    console.log('URL----------', url);
    console.log('data----------', data);
    const response = await apiClient.post(url, data);
    return response.data;
  } catch (error: any) {
    console.error('Error posting data:', error);
    const statusCode = error?.response?.status;
    const errorMessage = ERROR_MESSAGES[statusCode] || ERROR_MESSAGES.DEFAULT;
    showErrorToast(errorMessage);
    throw error;
  }
};
