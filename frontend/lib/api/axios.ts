import axios, { AxiosError } from 'axios';
import { ApiError } from './api-error';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (error.response) {
      return Promise.reject({
        message: error.response.data?.message ?? 'Server error',
        status: error.response.status,
      } satisfies ApiError);
    }

    return Promise.reject({
      message: 'Network error',
      status: 0,
    } satisfies ApiError);
  }
);
