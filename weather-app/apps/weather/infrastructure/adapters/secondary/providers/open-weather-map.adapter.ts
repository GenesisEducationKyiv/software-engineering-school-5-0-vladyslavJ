import { Injectable, Inject } from '@nestjs/common';
import { IWeatherProviderPort } from '../../../../domain/ports/providers/weather-provider.port';
import { IOpenWeatherMapResponse } from './interfaces/open-weather-map-response.interface';
import { IWeatherMapper } from './interfaces/weather-data-mapper.interface';
import { Weather } from '../../../../domain/models/weather.model';
import { IHttpClient } from '../http-client/interfaces/http-client.interface';
import { ProviderDiTokens } from './di/di-tokens';
import { ILogger } from '../../../../../../libs/modules/logger/interfaces/logger.interface';
import { LoggerDiTokens } from '../../../../../../libs/modules/logger/di/di-tokens';
import { HttpDiTokens } from '../http-client/di/di-tokens';
import { IOpenWeatherMapErrorData } from './interfaces/open-weather-map-error-response.interface';
import { mapWeatherApiError } from './mappers/open-weather-map-error.mapper';

@Injectable()
export class OpenWeatherMapAdapter implements IWeatherProviderPort {
  constructor(
    @Inject(HttpDiTokens.HTTP_CLIENT)
    private readonly httpClient: IHttpClient,
    @Inject(ProviderDiTokens.OpenWeatherMapMapper)
    private readonly mapper: IWeatherMapper<IOpenWeatherMapResponse>,
    @Inject(ProviderDiTokens.OpenWeatherMapApiKey)
    private readonly apiKey: string,
    @Inject(ProviderDiTokens.OpenWeatherMapBaseUrl)
    private readonly baseUrl: string,
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: ILogger,
  ) {}

  async fetchCurrentWeather(city: string): Promise<Weather> {
    const url = `${this.baseUrl}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`;
    try {
      const response = await this.httpClient.get(url);
      const data = await response.json();
      if (!response.ok) {
        throw mapWeatherApiError(data as IOpenWeatherMapErrorData);
      }
      this.logger.info(`openweathermap.org - response fetched`);
      return this.mapper.mapCurrentWeather(data as IOpenWeatherMapResponse);
    } catch (error) {
      this.logger.warn(`openweathermap.org - error: ${String(error)}`);
      throw error;
    }
  }
}
