import { injectable, inject } from 'tsyringe';
import { BaseHttpClient } from './http.client';
import { IWeatherApiResponse } from '../interfaces/weather-api-response.interface';
import { IWeatherApiProvider } from '../interfaces/weather-provider.interface';
import { ILogger } from '../interfaces/logger-service.interface';
import { TOKENS } from '../config/di-tokens.config';
import { IOpenWeatherMapResponse } from '../interfaces/open-weather-map-response.interface';
import { mapOpenWeatherMapToWeatherApiResponse } from '../mappers/open-weather-map.mapper';
import { IOpenWeatherMapErrorData } from '../interfaces/open-weather-map-error-response.interface';
import { mapWeatherApiError } from '../mappers/weather-error.mapper';
import ENV from '../config/env';

@injectable()
export class OpenWeatherMapClient
  extends BaseHttpClient<IOpenWeatherMapErrorData>
  implements IWeatherApiProvider
{
  private nextProvider: IWeatherApiProvider | null = null;
  constructor(@inject(TOKENS.ILogger) private readonly logger: ILogger) {
    super(
      {
        baseURL: ENV.OPENWEATHERMAP_BASE_URL,
        timeout: 21_000,
        params: { appid: ENV.OPENWEATHERMAP_API_KEY, units: 'metric' },
      },
      mapWeatherApiError,
    );
  }

  async fetchCurrentWeather(city: string): Promise<IWeatherApiResponse> {
    try {
      const response = await this.get<IOpenWeatherMapResponse>('/weather', { q: city });
      const mapped = mapOpenWeatherMapToWeatherApiResponse(response);
      this.logger.info(`openweathermap.org - Response: ${JSON.stringify(response)}`);
      return mapped;
    } catch (error) {
      this.logger.warn(`openweathermap.org - Error: ${error}`);
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
