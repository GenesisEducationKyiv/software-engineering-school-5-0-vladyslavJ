export default () => ({
  port: parseInt(process.env.PORT ?? '4000', 10),
  database: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    username: process.env.POSTGRES_USER ?? 'postgres',
    password: process.env.POSTGRES_PASSWORD ?? 'postgres',
    database: process.env.POSTGRES_DB ?? 'subscription',
  },
  appBaseUrl: process.env.APP_BASE_URL ?? 'http://localhost:3000',
});
