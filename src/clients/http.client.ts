import axios, { AxiosError, AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { injectable } from 'tsyringe';
import ENV from '../config/env';
import { HttpError } from '../utils/customError';
import { WeatherApiErrorData } from '../types/weatherApi.interfaces';

export interface IHttpClient {
  get<T>(url: string, params?: Record<string, unknown>): Promise<T>;
}

@injectable()
export class HttpClient implements IHttpClient {
  private readonly instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: ENV.WEATHER_BASE_URL,
      timeout: 21_000,
      params: { key: ENV.WEATHER_API_KEY, aqi: 'no' },
    });

    axiosRetry(this.instance, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: err => axiosRetry.isNetworkError(err) || axiosRetry.isRetryableError(err),
    });

    this.instance.interceptors.response.use(res => res, this.handleError.bind(this));
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const { data } = await this.instance.get<T>(url, { params });
    return data;
  }

  private handleError(error: AxiosError<WeatherApiErrorData>) {
    const apiCode = error.response?.data?.error?.code;

    if (apiCode === 1006) throw new HttpError('City not found', 404);
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout'))
      throw new HttpError('External API timeout', 504);

    const status = error.response?.status ?? 502;
    throw error instanceof HttpError
      ? error
      : new HttpError(error.message || 'External API error', status);
  }
}
