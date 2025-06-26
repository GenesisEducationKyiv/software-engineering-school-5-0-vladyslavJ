import { injectable, inject } from 'tsyringe';
import { BaseHttpClient } from './http.client';
import { IWeatherApiResponse } from '../interfaces/weather-api-response.interface';
import { IWeatherApiProvider } from '../interfaces/weather-api.provider.interface';
import { ILogger } from '../interfaces/logger.service.interface';
import { TOKENS } from '../config/di.tokens';
import { IOpenWeatherMapResponse } from '../interfaces/openWeatherMap-response.interface';
import { mapOpenWeatherMapToWeatherApiResponse } from '../mappers/openWeatherMap.mapper';
import { IOpenWeatherMapErrorData } from '../interfaces/openWeatherMap-error-response.interface';
import { mapWeatherApiError } from '../mappers/weatherApiError.mapper';
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
