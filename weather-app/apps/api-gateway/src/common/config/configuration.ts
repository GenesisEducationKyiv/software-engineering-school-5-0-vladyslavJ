export default () => ({
  port: process.env.PORT,
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  },
  weather: {
    host: process.env.WEATHER_HOST,
    port: parseInt(process.env.WEATHER_PORT ?? '5000', 10),
  },
  notification: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT ?? '465', 10),
  },
  subscription: {
    host: process.env.SUBSCRIPTION_HOST,
    port: parseInt(process.env.SUBSCRIPTION_PORT ?? '4000', 10),
  },
});
