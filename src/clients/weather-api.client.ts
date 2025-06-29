import { injectable, inject } from 'tsyringe';
import { BaseHttpClient } from './http.client';
import { IWeatherApiResponse } from '../interfaces/weather-api-response.interface';
import { IWeatherApiErrorData } from '../interfaces/weather-api-error-response.interface';
import ENV from '../config/env';
import { mapWeatherApiError } from '../mappers/weather-error.mapper';
import { IWeatherApiProvider } from '../interfaces/weather-provider.interface';
import { ILogger } from '../interfaces/logger-service.interface';
import { TOKENS } from '../config/di-tokens.config';

@injectable()
export class WeatherApiClient
  extends BaseHttpClient<IWeatherApiErrorData>
  implements IWeatherApiProvider
{
  private nextProvider: IWeatherApiProvider | null = null;
  constructor(@inject(TOKENS.ILogger) private readonly logger: ILogger) {
    super(
      {
        baseURL: ENV.WEATHER_BASE_URL,
        timeout: 21_000,
        params: { key: ENV.WEATHER_API_KEY, aqi: 'no' },
      },
      mapWeatherApiError,
    );
  }

  async fetchCurrentWeather(city: string): Promise<IWeatherApiResponse> {
    try {
      const response = await this.get<IWeatherApiResponse>('/current.json', { q: city });
      this.logger.info(`weatherapi.com - Response: ${JSON.stringify(response)}`);
      return response;
    } catch (error) {
      this.logger.warn(`weatherapi.com - Error: ${error}`);
      if (this.nextProvider) {
        return this.nextProvider.fetchCurrentWeather(city);
      }
      throw error;
    }
  }

  setNextProvider(provider: IWeatherApiProvider): void {
    this.nextProvider = provider;
  }
}
