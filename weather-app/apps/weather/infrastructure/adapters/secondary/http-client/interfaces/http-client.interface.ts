export interface IHttpClient {
  get(url: string, options?: RequestInit): Promise<Response>;
}
