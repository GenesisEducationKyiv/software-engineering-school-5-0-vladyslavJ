import { IWeatherApiResponse } from '../interfaces/weather-api-response.interface';

export interface IWeatherApiClient {
  fetchCurrent(city: string): Promise<IWeatherApiResponse>;
}
