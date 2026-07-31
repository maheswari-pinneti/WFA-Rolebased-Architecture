import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { axiosClient } from '../client/axiosClient';
import { STORAGE_KEYS } from '../../shared/constants/constants';

export const setupAuthInterceptors = () => {
  axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  axiosClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Handle token expiration / unauthorized
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      }
      return Promise.reject(error);
    }
  );
};
