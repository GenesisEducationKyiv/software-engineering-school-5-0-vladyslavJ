import { injectable, inject } from 'tsyringe';
import { BaseHttpClient } from '../../primary/api/clients/http.client';
import { IWeatherProviderPort } from '../../../../domain/ports/providers/weather-provider.port';
import { ILogger } from '../../../../shared/interfaces/logger-service.interface';
import { TOKENS } from '../../../di/di-tokens';
import { IOpenWeatherMapResponse } from './interfaces/open-weather-map-response.interface';
import { IOpenWeatherMapErrorData } from './interfaces/open-weather-map-error-response.interface';
import { mapWeatherApiError } from './mappers/weather-error.mapper';
import TIMEOUT from '../../../../shared/utils/constants/timeout.constant';
import ENV from '../../../config/env';
import { IWeatherMapper } from './interfaces/weather-data-mapper.interface';
import { Weather } from '../../../../domain/models/weather.model';

@injectable()
export class OpenWeatherMapAdapter
  extends BaseHttpClient<IOpenWeatherMapErrorData>
  implements IWeatherProviderPort
{
  private nextProvider: IWeatherProviderPort | null = null;
  constructor(
    @inject(TOKENS.ILogger) private readonly logger: ILogger,
    @inject(TOKENS.OpenWeatherMapMapper)
    private readonly mapper: IWeatherMapper<IOpenWeatherMapResponse>,
  ) {
    super(
      {
        baseURL: ENV.OPENWEATHERMAP_BASE_URL,
        timeout: TIMEOUT.WEATHER_API_TIMEOUT_MS,
        params: { appid: ENV.OPENWEATHERMAP_API_KEY, units: 'metric' },
      },
      mapWeatherApiError,
    );
  }

  async fetchCurrentWeather(city: string): Promise<Weather> {
    try {
      const response = await this.get<IOpenWeatherMapResponse>('/weather', { q: city });
      this.logger.info(`openweathermap.org - response fetched`);
      return this.mapper.mapCurrentWeather(response);
    } catch (error) {
      this.logger.warn(`openweathermap.org - error: ${error}`);
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
