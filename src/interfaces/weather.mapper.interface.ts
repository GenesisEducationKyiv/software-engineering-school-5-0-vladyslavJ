import { WeatherDto } from '../dto/weather.dto';
import { IWeatherApiResponse } from '../interfaces/weather-api-response.interface';

export interface IWeatherMapper {
  mapCurrentWeather(raw: IWeatherApiResponse): WeatherDto;
}
