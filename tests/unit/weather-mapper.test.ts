import 'reflect-metadata';
import { WeatherApiMapper } from '../../src/infrastructure/adapters/secondary/weather-providers/mappers/weather-api.mapper';
import { IWeatherApiResponse } from '../../src/infrastructure/adapters/secondary/weather-providers/interfaces/weather-api-response.interface';

describe('WeatherApiMapper', () => {
  it('Maps the weather API response object to Weather model', () => {
    const raw: IWeatherApiResponse = {
      location: {
        name: 'London',
        region: 'City of London, Greater London',
        country: 'United Kingdom',
        lat: 51.5171,
        lon: -0.1062,
        tz_id: 'Europe/London',
        localtime_epoch: 1750168260,
        localtime: '2025-06-17 14:51',
      },
      current: {
        last_updated_epoch: 1750167900,
        last_updated: '2025‑06‑17 14:45',
        temp_c: 26.0,
        temp_f: 78.8,
        is_day: 1,
        condition: {
          text: 'Sunny',
          icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
          code: 1000,
        },
        wind_mph: 8.1,
        wind_kph: 13.0,
        wind_degree: 263,
        wind_dir: 'W',
        pressure_mb: 1025.0,
        pressure_in: 30.27,
        precip_mm: 0.0,
        precip_in: 0.0,
        humidity: 45,
        cloud: 0,
        feelslike_c: 25.5,
        feelslike_f: 77.8,
        windchill_c: 26.3,
        windchill_f: 79.4,
        heatindex_c: 25.7,
        heatindex_f: 78.2,
        dewpoint_c: 8.0,
        dewpoint_f: 46.4,
        vis_km: 10.0,
        vis_miles: 6.0,
        uv: 7.0,
        gust_mph: 9.3,
        gust_kph: 14.9,
      },
    };

    const mapper = new WeatherApiMapper();
    const weather = mapper.mapCurrentWeather(raw);

    expect(weather).toEqual({
      temperature: 26.0,
      humidity: 45,
      description: 'Sunny',
    });
  });
});
