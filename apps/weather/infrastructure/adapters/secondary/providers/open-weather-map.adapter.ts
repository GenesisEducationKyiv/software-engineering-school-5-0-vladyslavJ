import { Injectable, Inject } from '@nestjs/common';
import { IWeatherProviderPort } from '../../../../domain/ports/providers/weather-provider.port';
import { IOpenWeatherMapResponse } from './interfaces/open-weather-map-response.interface';
import { IWeatherMapper } from './interfaces/weather-data-mapper.interface';
import { Weather } from '../../../../../../libs/common/models/weather.model';
import { IHttpClient } from '../http-client/interfaces/http-client.interface';
import { ProviderDiTokens } from './di/di-tokens';
import { LoggerInterface } from '../../../../../../libs/modules/logger/interfaces/logger.interface';
import { LoggerDiTokens } from '../../../../../../libs/modules/logger/di/di-tokens';
import { HttpDiTokens } from '../http-client/di/di-tokens';
import { IOpenWeatherMapErrorData } from './interfaces/open-weather-map-error-response.interface';
import { mapWeatherApiError } from './mappers/open-weather-map-error.mapper';
import { GrpcCode } from '../../../../../../libs/common/enums/grpc-codes.enum';
import { RpcException } from '@nestjs/microservices';

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
    private readonly logger: LoggerInterface,
  ) {
    this.logger.setContext(OpenWeatherMapAdapter.name);
  }

  private buildExternalWeatherApiUrl(city: string): string {
    const url = new URL(`${this.baseUrl}/weather`);
    url.searchParams.set('q', city);
    url.searchParams.set('appid', this.apiKey);
    url.searchParams.set('units', 'metric');
    return url.toString();
  }

  async fetchCurrentWeather(city: string): Promise<Weather> {
    const url = this.buildExternalWeatherApiUrl(city);
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
