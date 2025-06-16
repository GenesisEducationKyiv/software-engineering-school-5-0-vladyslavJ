import { inject, injectable } from 'tsyringe';
import { IWeatherApiClient } from '../clients/weatherApi.client';
import { ICacheService } from './cache.service';
import { IWeatherMapper } from '../mappers/weather.mapper';
import { WeatherDto } from '../dto/weather.dto';
import { TOKENS } from '../config/di.tokens';
import { logger } from '../utils/logger';

@injectable()
export class WeatherService {
  constructor(
    @inject(TOKENS.IWeatherApiClient) private api: IWeatherApiClient,
    @inject(TOKENS.CacheServiceWeather) private cache: ICacheService<WeatherDto>,
    @inject(TOKENS.IWeatherMapper) private mapper: IWeatherMapper,
    @inject(TOKENS.RedisTTL) private readonly ttl: number,
  ) {}

  async getWeather(city: string): Promise<WeatherDto> {
    const key = `weather:${city.toLowerCase()}`;
    logger.info(`Weather data request for: ${city}`);

    const cached = await this.cache.get(key);
    if (cached) {
      logger.info(`Cache hit for ${city}`);
      return cached;
    }

    logger.info(`Cache miss for ${city}, calling API`);
    const raw = await this.api.fetchCurrent(city);
    const dto = this.mapper.mapCurrentWeather(raw);

    await this.cache.set(key, dto, this.ttl);
    logger.info(`Cached data for ${city}`);
    return dto;
  }
}
