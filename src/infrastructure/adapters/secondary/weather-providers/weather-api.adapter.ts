import { injectable, inject } from 'tsyringe';
import { BaseHttpClient } from '../../primary/api/clients/http.client';
import { IWeatherApiResponse } from './interfaces/weather-api-response.interface';
import { IWeatherApiErrorData } from './interfaces/weather-api-error-response.interface';
import ENV from '../../../config/env';
import { mapWeatherApiError } from './mappers/weather-error.mapper';
import { ILogger } from '../../../../shared/interfaces/logger-service.interface';
import { TOKENS } from '../../../di/di-tokens';
import TIMEOUT from '../../../../shared/utils/constants/timeout.constant';
import { IWeatherProviderPort } from '../../../../domain/ports/providers/weather-provider.port';
import { Weather } from '../../../../domain/models/weather.model';
import { IWeatherMapper } from './interfaces/weather-data-mapper.interface';

@injectable()
export class WeatherApiAdapter
  extends BaseHttpClient<IWeatherApiErrorData>
  implements IWeatherProviderPort
{
  private nextProvider: IWeatherProviderPort | null = null;
  constructor(
    @inject(TOKENS.ILogger) private readonly logger: ILogger,
    @inject(TOKENS.WeatherApiMapper) private readonly mapper: IWeatherMapper<IWeatherApiResponse>,
  ) {
    super(
      {
        baseURL: ENV.WEATHER_BASE_URL,
        timeout: TIMEOUT.WEATHER_API_TIMEOUT_MS,
        params: { key: ENV.WEATHER_API_KEY, aqi: 'no' },
      },
      mapWeatherApiError,
    );
  }

  async fetchCurrentWeather(city: string): Promise<Weather> {
    try {
      const response = await this.get<IWeatherApiResponse>('/current.json', { q: city });
      this.logger.info(`weatherapi.com - response fetched`);
      return this.mapper.mapCurrentWeather(response);
    } catch (error) {
      this.logger.warn(`weatherapi.com - error: ${error}`);
      if (this.nextProvider) {
        return this.nextProvider.fetchCurrentWeather(city);
      }
      throw error;
    }
  }

  setNextProvider(provider: IWeatherProviderPort): void {
    this.nextProvider = provider;
  }
}
