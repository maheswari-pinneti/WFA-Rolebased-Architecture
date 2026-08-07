import axios from 'axios';
import { API_TIMEOUT } from '../../shared/constants/constants';

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.workforce-analytics.internal/v1',
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});
