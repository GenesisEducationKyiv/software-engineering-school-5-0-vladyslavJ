export const TOKENS = {
  IWeatherApiProvider: Symbol.for('IWeatherApiProvider'),
  IWeatherApiClient: Symbol.for('IWeatherApiClient'),
  CacheServiceWeather: Symbol.for('CacheServiceWeather'),
  //ICacheService: Symbol.for('ICacheService'),
  IWeatherMapper: Symbol.for('IWeatherMapper'),
  WeatherService: Symbol.for('WeatherService'),
  WeatherController: Symbol.for('WeatherController'),
  WeatherDigestJob: Symbol.for('WeatherDigestJob'),
  IEmailTransport: Symbol.for('IEmailTransport'),
  IEmailService: Symbol.for('IEmailService'),
  SubscriptionService: Symbol.for('SubscriptionService'),
  SubscriptionController: Symbol.for('SubscriptionController'),
  ISubscriptionRepository: Symbol.for('ISubscriptionRepository'),
  ILogger: Symbol.for('ILogger'),
  ErrorHandlerMiddleware: Symbol.for('ErrorHandlerMiddleware'),
  RedisHost: Symbol.for('RedisHost'),
  RedisPort: Symbol.for('RedisPort'),
  RedisDefaultTTL: Symbol.for('RedisDefaultTTL'),

  IWeatherInputPort: Symbol('IWeatherInputPort'),
  IWeatherProviderPort: Symbol('IWeatherProviderPort'),
  IWeatherCachePort: Symbol('IWeatherCachePort'),

  IRedisClient: Symbol('IRedisClient'),
  ICacheMetricService: Symbol('ICacheMetricService'),

  RedisTTL: Symbol('RedisTTL'),

  WeatherApiMapper: Symbol.for('WeatherApiMapper'),
  OpenWeatherMapMapper: Symbol.for('OpenWeatherMapMapper'),

  IEmailPort: Symbol('IEmailPort'),

  ISubscriptionInputPort: Symbol('ISubscriptionInputPort'),
  SubscribeUseCase: Symbol('SubscribeUseCase'),
  ConfirmSubscriptionUseCase: Symbol('ConfirmSubscriptionUseCase'),
  UnsubscribeUseCase: Symbol('UnsubscribeUseCase'),
  GetWeatherUseCase: Symbol('GetWeatherUseCase'),

  ISubscriptionMapper: Symbol('ISubscriptionMapper'),
  //SubscriptionMapper: Symbol.for('SubscriptionMapper'),
} as const;
