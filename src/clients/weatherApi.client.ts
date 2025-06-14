import http from './http.client';
import { WeatherApiResponse } from '../types/weatherApi.interfaces';

export interface IWeatherApiClient {
  fetchCurrent(city: string): Promise<WeatherApiResponse>;
}

export class WeatherApiClient implements IWeatherApiClient {
  async fetchCurrent(city: string): Promise<WeatherApiResponse> {
    const { data } = await http.get<WeatherApiResponse>('/current.json', { params: { q: city } });
    return data;
  }
}
