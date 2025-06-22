export interface IHttpClient {
  get<T>(url: string, params?: Record<string, unknown>): Promise<T>;
  post<T>(url: string, body?: unknown, params?: Record<string, unknown>): Promise<T>;
  put<T>(url: string, body?: unknown, params?: Record<string, unknown>): Promise<T>;
  patch<T>(url: string, body?: unknown, params?: Record<string, unknown>): Promise<T>;
  delete<T>(url: string, params?: Record<string, unknown>): Promise<T>;
}
