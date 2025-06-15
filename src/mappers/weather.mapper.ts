import { WeatherDto } from '../dto/weather.dto';
import { WeatherApiResponse } from '../types/weatherApi.interfaces';

export class WeatherMapper {
  mapCurrentWeather(raw: WeatherApiResponse): WeatherDto {
    return new WeatherDto({
      temperature: raw?.current?.temp_c,
      humidity: raw?.current?.humidity,
      description: raw?.current?.condition?.text,
    });
  }
}
