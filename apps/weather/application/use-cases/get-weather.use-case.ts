import { Injectable, Inject } from '@nestjs/common';
import { Weather } from '../../../../libs/common/interfaces/weather.interface';
import { IWeatherCachePort } from '../../domain/ports/cache/weather-cache.port';
import { IWeatherProviderPort } from '../../domain/ports/providers/weather-provider.port';
import { CacheDiTokens } from '../../infrastructure/adapters/secondary/cache/di/di-tokens';
import { ProviderDiTokens } from '../../infrastructure/adapters/secondary/providers/di/di-tokens';

@Injectable()
export class GetWeatherUseCase {
  constructor(
    @Inject(ProviderDiTokens.CHAIN_WEATHER_SERVICE)
    private readonly weatherProvider: IWeatherProviderPort,
    @Inject(CacheDiTokens.WEATHER_CACHE_SERVICE)
    private readonly cache: IWeatherCachePort,
    @Inject(CacheDiTokens.WEATHER_TTL)
    private readonly ttl: number,
  ) {}

  async getWeather(city: string): Promise<Weather> {
    const key = `weather:${city.toLowerCase()}`;
    const cached = await this.cache.get(key);
    if (cached) {
      return cached;
    }

    const weather = await this.weatherProvider.fetchCurrentWeather(city);
    await this.cache.set(key, weather, this.ttl);
    return weather;
  }
}
