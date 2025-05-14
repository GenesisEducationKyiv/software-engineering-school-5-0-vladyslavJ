import http from '../utils/httpClient.js';
import { WeatherDto } from '../dto/weather.dto.js';

class WeatherService {
	#mapCurrentWeather(raw) {
		return new WeatherDto({
			temperature: raw?.current?.temp_c,
			humidity: raw?.current?.humidity,
			description: raw?.current?.condition?.text,
		});
	}

	async getWeather(city) {
		const { data } = await http.get('/current.json', {
			params: { q: city },
		});
		return this.#mapCurrentWeather(data);
	}
}

export default new WeatherService();
