import WeatherService from '../services/weather.service.js';

export const getWeather = async (req, res, next) => {
	try {
		const { city } = req.validatedQuery;
		const weather = await WeatherService.getWeather(city);
		res.status(200).json(weather);
	} catch (error) {
		return next(error);
	}
};
