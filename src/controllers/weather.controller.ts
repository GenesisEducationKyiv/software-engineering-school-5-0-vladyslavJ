import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { WeatherService } from '../services/weather.service';

@injectable()
export class WeatherController {
  constructor(
    @inject(WeatherService)
    private readonly weatherService: WeatherService,
  ) {}

  async getWeather(req: Request, res: Response, next: NextFunction) {
    try {
      const { city } = req.validatedQuery as { city: string };
      const weather = await this.weatherService.getWeather(city);
      res.status(200).json(weather);
    } catch (err) {
      next(err);
    }
  }
}
