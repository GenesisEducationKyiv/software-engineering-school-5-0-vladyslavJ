import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/di-tokens';
import { Weather } from '../../../domain/models/weather.model';
import { IWeatherProviderPort } from '../../../domain/ports/providers/weather-provider.port';
import { IWeatherCachePort } from '../../../domain/ports/cache/weather-cache.port';
import { ILogger } from '../../../shared/interfaces/logger-service.interface';

@injectable()
export class GetWeatherUseCase {
  constructor(
    @inject(TOKENS.IWeatherProviderPort) private weatherProvider: IWeatherProviderPort,
    @inject(TOKENS.IWeatherCachePort) private cache: IWeatherCachePort,
    @inject(TOKENS.ILogger) private readonly logger: ILogger,
    @inject(TOKENS.RedisTTL) private readonly ttl: number,
  ) {}

  async getWeather(city: string): Promise<Weather> {
    const key = `weather:${city.toLowerCase()}`;
    this.logger.info(`Weather data request for: ${city}`);

    const cached = await this.cache.get(key);
    if (cached) {
      this.logger.info(`Cache hit for ${city}`);
      return cached;
    }

    const weather = await this.weatherProvider.fetchCurrentWeather(city);
    this.logger.info(`Cache miss for ${city}, calling external API`);

    await this.cache.set(key, weather, this.ttl);
    this.logger.info(`Cached data for ${city}`);
    return weather;
  }
}
