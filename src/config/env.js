import dotenv from 'dotenv';
import { checkEnv } from '../utils/cheakEnv.js';

dotenv.config();

const ENV = Object.freeze({
	PORT: process.env.PORT || 3000,
	WEATHER_API_KEY: process.env.WEATHER_API_KEY,
	WEATHER_BASE_URL: process.env.WEATHER_BASE_URL,
});

checkEnv(ENV);

export default ENV;
