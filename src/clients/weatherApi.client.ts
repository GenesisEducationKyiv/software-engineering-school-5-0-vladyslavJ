import { injectable, inject } from 'tsyringe';
import { IHttpClient } from './http.client';
import { WeatherApiResponse } from '../types/weatherApi.interfaces';

export interface IWeatherApiClient {
  fetchCurrent(city: string): Promise<WeatherApiResponse>;
}

@injectable()
export class WeatherApiClient implements IWeatherApiClient {
  constructor(@inject('IHttpClient') private readonly http: IHttpClient) {}

  fetchCurrent(city: string): Promise<WeatherApiResponse> {
    return this.http.get<WeatherApiResponse>('/current.json', { q: city });
  }
}
