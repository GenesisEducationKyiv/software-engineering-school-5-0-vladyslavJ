import { injectable } from 'tsyringe';
import { WeatherDto } from '../dto/weather.dto';
import { IWeatherApiResponse } from '../interfaces/weather-api-response.interface';
import { IWeatherMapper } from '../interfaces/weather-data-mapper.interface';

@injectable()
export class WeatherMapper implements IWeatherMapper {
  mapCurrentWeather(raw: IWeatherApiResponse): WeatherDto {
    return new WeatherDto({
      temperature: raw?.current?.temp_c,
      humidity: raw?.current?.humidity,
      description: raw?.current?.condition?.text,
    });
  }
}
