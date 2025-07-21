export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    ttl: parseInt(process.env.REDIS_TTL ?? '300', 10),
    defaultTtl: parseInt(process.env.REDIS_DEFAULT_TTL ?? '604800', 10),
  },
  weather: {
    weatherApiKey: process.env.WEATHER_API_KEY,
    weatherBaseUrl: process.env.WEATHER_BASE_URL,
    weatherHost: process.env.WEATHER_HOST,
    weatherPort: parseInt(process.env.WEATHER_PORT ?? '5000', 10),
    openWeatherMapApiKey: process.env.OPENWEATHERMAP_API_KEY,
    openWeatherMapBaseUrl: process.env.OPENWEATHERMAP_BASE_URL,
  },
  appBaseUrl: process.env.APP_BASE_URL ?? 'http://localhost:3000',
});
