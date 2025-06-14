import { IWeatherApiClient } from '../clients/weatherApi.client';
import { ICacheService } from './cache.service';
import { WeatherMapper } from '../mappers/weather.mapper';
import { WeatherDto } from '../dto/weather.dto';
import { logger } from '../utils/logger';
import ENV from '../config/env';

export class WeatherService {
  constructor(
    private apiClient: IWeatherApiClient,
    private cache: ICacheService<WeatherDto>,
    private mapper: WeatherMapper,
    private ttl: number = ENV.REDIS_TTL,
  ) {}

  async getWeather(city: string): Promise<WeatherDto> {
    const key = `weather:${city.toLowerCase()}`;

    logger.info(`Weather data request for: ${city}`);
    const cached = await this.cache.get(key);
    if (cached) {
      logger.info(`Cache for ${city}`);
      return cached;
    }

    logger.info(`Cache miss for ${city}, request to API`);
    const raw = await this.apiClient.fetchCurrent(city);
    const dto = this.mapper.mapCurrentWeather(raw);

    await this.cache.set(key, dto, this.ttl);
    logger.info(`Cached data for ${city}`);
    return dto;
  }
}
