// src/services/weather.service.ts

import http from '../utils/httpClient';
import { WeatherDto } from '../dto/weather.dto';
import { redisClient } from '../utils/redisClient';
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

		const cached = await redisClient.get(key);
		if (cached) return JSON.parse(cached) as WeatherDto;

		const { data } = await http.get('/current.json', {
			params: { q: city },
		});
		const weather = this.mapCurrentWeather(data);

		await redisClient.set(key, JSON.stringify(weather), {
			EX: ENV.REDIS_TTL,
		});

		return weather;
	}
}

export default new WeatherService();
