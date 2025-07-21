import { Injectable, Inject } from '@nestjs/common';
import { IHttpClient } from '../http-client/interfaces/http-client.interface';
import { IWeatherApiResponse } from './interfaces/weather-api-response.interface';
import { IWeatherProviderPort } from '../../../../domain/ports/providers/weather-provider.port';
import { Weather } from '../../../../domain/models/weather.model';
import { IWeatherMapper } from './interfaces/weather-data-mapper.interface';
import { ProviderDiTokens } from './di/di-tokens';
import { HttpDiTokens } from '../http-client/di/di-tokens';
import { ILogger } from '../../../../../../libs/modules/logger/interfaces/logger.interface';
import { LoggerDiTokens } from '../../../../../../libs/modules/logger/di/di-tokens';
import { IWeatherApiErrorData } from './interfaces/weather-api-error-response.interface';
import { mapWeatherApiError } from './mappers/weather-api-error.mapper';
import { GrpcCode } from '../../../../../../libs/common/enums/grpc-codes.enum';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class WeatherApiAdapter implements IWeatherProviderPort {
  constructor(
    @Inject(HttpDiTokens.HTTP_CLIENT)
    private readonly httpClient: IHttpClient,
    @Inject(ProviderDiTokens.WeatherApiMapper)
    private readonly mapper: IWeatherMapper<IWeatherApiResponse>,
    @Inject(ProviderDiTokens.WeatherApiKey)
    private readonly apiKey: string,
    @Inject(ProviderDiTokens.WeatherBaseUrl)
    private readonly baseUrl: string,
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: ILogger,
  ) {}

  async fetchCurrentWeather(city: string): Promise<Weather> {
    const url = `${this.baseUrl}/current.json?q=${encodeURIComponent(city)}&key=${this.apiKey}&aqi=no`;
    try {
      const response = await this.httpClient.get(url);
      const data = await response.json();
      if (!response.ok) {
        throw mapWeatherApiError(data as IWeatherApiErrorData);
      }
      this.logger.info(`weatherapi.com - response fetched`);
      return this.mapper.mapCurrentWeather(data as IWeatherApiResponse);
    } catch (error) {
      this.logger.warn(`weatherapi.com - error: ${String(error)}`);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        code: GrpcCode.SERVICE_UNAVAILABLE,
        message: 'Failed to fetch weather data',
        details: String(error),
      });
    }
  }
}
