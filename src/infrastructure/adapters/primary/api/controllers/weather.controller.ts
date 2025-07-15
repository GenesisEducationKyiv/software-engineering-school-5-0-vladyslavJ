import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../../di/di-tokens';
import { IWeatherInputPort } from '../../../../../application/ports/weather.port';

@injectable()
export class WeatherController {
  constructor(
    @inject(TOKENS.IWeatherInputPort) private readonly weatherService: IWeatherInputPort,
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
