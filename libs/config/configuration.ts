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
    host: process.env.NOTIFICATION_HOST,
    port: parseInt(process.env.NOTIFICATION_PORT ?? '6600', 10),
  },
  subscription: {
    host: process.env.SUBSCRIPTION_HOST,
    port: parseInt(process.env.SUBSCRIPTION_PORT ?? '4000', 10),
  },
  logger: {
    path: process.env.LOGGER_PATH,
    samplingRate: parseFloat(process.env.LOGGER_SAMPLING_RATE ?? '0.3'),
    retention: {
      error: parseInt(process.env.LOG_RETENTION_ERROR ?? '90', 10),
      warn: parseInt(process.env.LOG_RETENTION_WARN ?? '30', 10),
      info: parseInt(process.env.LOG_RETENTION_INFO ?? '14', 10),
      debug: parseInt(process.env.LOG_RETENTION_DEBUG ?? '7', 10),
    },
  },
});
