import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { IWeatherProviderPort } from '../../../../domain/ports/providers/weather-provider.port';
import { Weather } from '../../../../domain/models/weather.model';
import { LoggerDiTokens } from '../../../../../../libs/modules/logger/di/di-tokens';
import { ILogger } from '../../../../../../libs/modules/logger/interfaces/logger.interface';

@Injectable()
export class ChainWeatherService implements IWeatherProviderPort {
  constructor(
    private readonly providers: IWeatherProviderPort[],
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: ILogger,
  ) {}

  async fetchCurrentWeather(city: string): Promise<Weather> {
    for (const provider of this.providers) {
      try {
        return await provider.fetchCurrentWeather(city);
      } catch (error) {
        this.logger.warn(`Provider ${provider.constructor.name} failed: ${String(error)}`);
        if (error instanceof HttpException && error.getStatus() === HttpStatus.NOT_FOUND) {
          throw new HttpException('City not found', HttpStatus.NOT_FOUND);
        }
        if (error instanceof HttpException && error.getStatus() === HttpStatus.BAD_REQUEST) {
          throw new HttpException('Invalid request', HttpStatus.BAD_REQUEST);
        }
        continue;
      }
    }
    throw new Error(`All providers are unavailable`);
  }
}
