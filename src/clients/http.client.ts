import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';

export interface IHttpClient {
  get<T>(url: string, params?: Record<string, unknown>): Promise<T>;
  post<T>(url: string, body?: unknown, params?: Record<string, unknown>): Promise<T>;
  put<T>(url: string, body?: unknown, params?: Record<string, unknown>): Promise<T>;
  patch<T>(url: string, body?: unknown, params?: Record<string, unknown>): Promise<T>;
  delete<T>(url: string, params?: Record<string, unknown>): Promise<T>;
}

export type ErrorMapper<E = unknown> = (error: AxiosError<E>) => Error;

export class BaseHttpClient<E = unknown> implements IHttpClient {
  protected readonly instance: AxiosInstance;
  private readonly mapError?: ErrorMapper<E>;

  constructor(config: AxiosRequestConfig, mapError?: ErrorMapper<E>) {
    this.instance = axios.create(config);
    this.mapError = mapError;

    axiosRetry(this.instance, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: err => axiosRetry.isNetworkError(err) || axiosRetry.isRetryableError(err),
    });

    this.instance.interceptors.response.use(
      res => res,
      (err: AxiosError<E>) => {
        if (this.mapError) throw this.mapError(err);
        throw err;
      },
    );
  }

  async get<T>(url: string, params?: Record<string, unknown>) {
    const { data } = await this.instance.get<T>(url, { params });
    return data;
  }

  async post<T>(url: string, body?: unknown, params?: Record<string, unknown>) {
    const { data } = await this.instance.post<T>(url, body, { params });
    return data;
  }

  async put<T>(url: string, body?: unknown, params?: Record<string, unknown>) {
    const { data } = await this.instance.put<T>(url, body, { params });
    return data;
  }

  async patch<T>(url: string, body?: unknown, params?: Record<string, unknown>) {
    const { data } = await this.instance.patch<T>(url, body, { params });
    return data;
  }

  async delete<T>(url: string, params?: Record<string, unknown>) {
    const { data } = await this.instance.delete<T>(url, { params });
    return data;
  }
}
