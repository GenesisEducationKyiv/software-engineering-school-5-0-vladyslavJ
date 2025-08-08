import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { Empty } from '../../../../../libs/common/types/empty.type';

@Controller('/weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather(@Query('city') city: string) {
    return this.weatherService.getWeather({ city });
  }

  @Get('/metrics')
  async getMetrics(req: Empty) {
    return this.weatherService.getMetrics(req);
  }
}
