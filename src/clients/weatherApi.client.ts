import { injectable } from 'tsyringe';
import { BaseHttpClient } from './http.client';
import { IWeatherApiResponse } from '../interfaces/weather-api-response.interface';
import { IWeatherApiErrorData } from '../interfaces/weather-api-error-response.interface';
import ENV from '../config/env';
import { mapWeatherApiError } from '../mappers/weatherApiError.mapper';
import { IWeatherApiClient } from '../interfaces/weather-api.client.interface';

@injectable()
export class WeatherApiClient
  extends BaseHttpClient<IWeatherApiErrorData>
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
    return this.get<IWeatherApiResponse>('/current.json', { q: city });
  }
}
