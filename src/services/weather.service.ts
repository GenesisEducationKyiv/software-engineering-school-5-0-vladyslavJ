import { inject, injectable } from 'tsyringe';
import { IWeatherApiProvider } from '../interfaces/weather-api.provider.interface';
import { ICacheService } from '../interfaces/cache.service.interface';
import { IWeatherMapper } from '../interfaces/weather-data.mapper.interface';
import { WeatherDto } from '../dto/weather.dto';
import { ILogger } from '../interfaces/logger.service.interface';
import { TOKENS } from '../config/di.tokens';

@injectable()
export class WeatherService {
  constructor(
    @inject(TOKENS.IWeatherApiProvider) private api: IWeatherApiProvider,
    @inject(TOKENS.CacheServiceWeather) private cache: ICacheService<WeatherDto>,
    @inject(TOKENS.IWeatherMapper) private mapper: IWeatherMapper,
    @inject(TOKENS.RedisTTL) private readonly ttl: number,
    @inject(TOKENS.ILogger) private readonly logger: ILogger,
  ) {}

  async getWeather(city: string): Promise<WeatherDto> {
    const key = `weather:${city.toLowerCase()}`;
    this.logger.info(`Weather data request for: ${city}`);

    const cached = await this.cache.get(key);
    if (cached) {
      this.logger.info(`Cache hit for ${city}`);
      return cached;
    }

    this.logger.info(`Cache miss for ${city}, calling API`);
    const raw = await this.api.fetchCurrentWeather(city);
    const dto = this.mapper.mapCurrentWeather(raw);

    await this.cache.set(key, dto, this.ttl);
    this.logger.info(`Cached data for ${city}`);
    return dto;
  }
}
