import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller()
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('/weather')
  async getWeather(@Query('city') city: string) {
    return this.weatherService.getWeather({ city });
  }
}
