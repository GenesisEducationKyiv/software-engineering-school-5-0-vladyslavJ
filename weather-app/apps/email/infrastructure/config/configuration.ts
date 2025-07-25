export default () => ({
  port: parseInt(process.env.PORT ?? '4650', 10),
  email: {
    host: process.env.MAIL_HOST ?? 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT ?? '465', 10),
    secure: process.env.MAIL_SECURE === 'true',
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    from: process.env.MAIL_FROM ?? 'Weather API <no-reply@weatherapi.app>',
  },
  appBaseUrl: process.env.APP_BASE_URL ?? 'http://localhost:3000',
});
