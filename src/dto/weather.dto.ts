export class WeatherDto {
	temperature: number;
	humidity: number;
	description: string;

	constructor(props?: Partial<WeatherDto>) {
		this.temperature = props?.temperature ?? 0;
		this.humidity = props?.humidity ?? 0;
		this.description = props?.description ?? 'N/A';
	}
}
