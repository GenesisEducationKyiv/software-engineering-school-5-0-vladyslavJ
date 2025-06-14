import axios, { AxiosError } from 'axios';
import { HttpError } from '../utils/customError';
import { WeatherApiErrorData } from '../types/weatherApi.interfaces';
import ENV from '../config/env';

const { WEATHER_BASE_URL, WEATHER_API_KEY } = ENV;
const WEATHER_TIMEOUT = 21_000;
const WEATHER_DEFAULT_PARAMS = { aqi: 'no' };

const http = axios.create({
  baseURL: WEATHER_BASE_URL,
  timeout: WEATHER_TIMEOUT,
  params: {
    key: WEATHER_API_KEY,
    aqi: WEATHER_DEFAULT_PARAMS,
  },
});

http.interceptors.response.use(
  res => res,
  (error: AxiosError<WeatherApiErrorData>) => {
    const apiCode = error.response?.data?.error?.code;
    if (apiCode === 1006) {
      return Promise.reject(new HttpError('City not found', 404));
    }

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return Promise.reject(new HttpError('External API timeout', 504));
    }

    const status = error.response?.status ?? 502;
    return Promise.reject(
      error instanceof HttpError
        ? error
        : new HttpError(error.message || 'External API error', status),
    );
  },
);

export default http;
