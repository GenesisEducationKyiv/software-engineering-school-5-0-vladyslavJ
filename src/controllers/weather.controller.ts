import { Request, Response, NextFunction } from 'express';
import { WeatherService } from '../services/weather.service';

export const createWeatherController = (weatherService: WeatherService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { city } = req.validatedQuery as { city: string };
      const weather = await weatherService.getWeather(city);
      res.status(200).json(weather);
    } catch (error) {
      next(error);
    }
  };
};
