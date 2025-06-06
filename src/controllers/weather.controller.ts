import { Request, Response, NextFunction } from 'express';
import WeatherService from '../services/weather.service';

type ValidatedQuery = { city: string };

export const getWeather = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { city } = (req.validatedQuery as ValidatedQuery)!;
    const weather = await WeatherService.getWeather(city);
    res.status(200).json(weather);
  } catch (error) {
    next(error);
  }
};
