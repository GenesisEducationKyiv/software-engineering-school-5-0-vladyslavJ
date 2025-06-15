import { injectable } from 'tsyringe';
import { BaseHttpClient } from './http.client';
import { WeatherApiResponse, WeatherApiErrorData } from '../types/weatherApi.interfaces';
import ENV from '../config/env';
import { mapWeatherApiError } from '../mappers/weatherApiError.mapper';

export interface IWeatherApiClient {
  fetchCurrent(city: string): Promise<WeatherApiResponse>;
}

@injectable()
export class WeatherApiClient
  extends BaseHttpClient<WeatherApiErrorData>
  implements IWeatherApiClient
{
  constructor() {
    super(
      {
        baseURL: ENV.WEATHER_BASE_URL,
        timeout: 21_000,
        params: { key: ENV.WEATHER_API_KEY, aqi: 'no' },
      },
      mapWeatherApiError,
    );
  }

  fetchCurrent(city: string) {
    return this.get<WeatherApiResponse>('/current.json', { q: city });
  }
}
