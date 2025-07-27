export default () => ({
  port: parseInt(process.env.NOTIFICATION_PORT ?? '6600', 10),
  email: {
    host: process.env.MAIL_HOST,
    port: '8888',
  },
  subscription: {
    host: process.env.SUBSCRIPTION_HOST,
    port: process.env.SUBSCRIPTION_PORT,
  },
  weather: {
    host: process.env.WEATHER_HOST,
    port: parseInt(process.env.WEATHER_PORT ?? '5000', 10),
  },
  appBaseUrl: process.env.APP_BASE_URL ?? 'http://localhost:3000',
});
