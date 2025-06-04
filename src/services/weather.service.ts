import http from '../utils/httpClient';
import { WeatherDto } from '../dto/weather.dto';
import { redisClient } from '../utils/redisClient';
import { logger } from '../utils/logger';
import ENV from '../config/env';

class WeatherService {
	private mapCurrentWeather(raw: any): WeatherDto {
		return new WeatherDto({
			temperature: raw?.current?.temp_c,
			humidity: raw?.current?.humidity,
			description: raw?.current?.condition?.text,
		});
	}

	async getWeather(city: string): Promise<WeatherDto> {
		const key = `weather:${city.toLowerCase()}`;
		logger.info(`Requesting weather for city: ${city}`);

		const cached = await redisClient.get(key);
		if (cached) {
			logger.info(`Weather cache hit for city: ${city}`);
			return JSON.parse(cached) as WeatherDto;
		}

		logger.info(`Weather cache miss for city: ${city}. Fetching from API.`);
		const { data } = await http.get('/current.json', {
			params: { q: city },
		});
		const weather = this.mapCurrentWeather(data);

		await redisClient.set(key, JSON.stringify(weather), {
			EX: ENV.REDIS_TTL,
		});
		logger.info(`Weather data cached for city: ${city}`);

		return weather;
	}
}

export default new WeatherService();
