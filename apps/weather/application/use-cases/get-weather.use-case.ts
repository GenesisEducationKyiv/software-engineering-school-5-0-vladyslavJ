import { Injectable, Inject } from '@nestjs/common';
import { Weather } from '../../../../libs/common/interfaces/weather.interface';
import { IWeatherCachePort } from '../../domain/ports/cache/weather-cache.port';
import { IWeatherProviderPort } from '../../domain/ports/providers/weather-provider.port';
import { CacheDiTokens } from '../../infrastructure/adapters/secondary/cache/di/di-tokens';
import { ProviderDiTokens } from '../../infrastructure/adapters/secondary/providers/di/di-tokens';
import { LoggerDiTokens } from '../../../../libs/modules/logger/di/di-tokens';
import { LoggerInterface } from '../../../../libs/modules/logger/interfaces/logger.interface';

@Injectable()
export class GetWeatherUseCase {
  constructor(
    @Inject(ProviderDiTokens.CHAIN_WEATHER_SERVICE)
    private readonly weatherProvider: IWeatherProviderPort,
    @Inject(CacheDiTokens.WEATHER_CACHE_SERVICE)
    private readonly cache: IWeatherCachePort,
    @Inject(CacheDiTokens.WEATHER_TTL)
    private readonly ttl: number,
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: LoggerInterface,
  ) {
    this.logger.setContext(GetWeatherUseCase.name);
  }

  async getWeather(city: string): Promise<Weather> {
    this.logger.info(`getWeather called for city: ${city}`);
    const key = `weather:${city.toLowerCase()}`;
    try {
      this.logger.info(`Checking cache for key: ${key}`);
      const cached = await this.cache.get(key);
      if (cached) {
        this.logger.info('Cache hit');
        return cached;
      }
      this.logger.info('Cache miss, fetching from provider');
      const weather = await this.weatherProvider.fetchCurrentWeather(city);
      await this.cache.set(key, weather, this.ttl);
      return weather;
    } catch (error) {
      this.logger.error('Error getting weather', error);
      throw error;
    }
  }
}
