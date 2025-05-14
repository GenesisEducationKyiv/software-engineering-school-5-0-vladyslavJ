export class WeatherDto {
	constructor({ temperature = 0, humidity = 0, description = 'N/A' } = {}) {
		this.temperature = temperature;
		this.humidity = humidity;
		this.description = description;
	}
}
