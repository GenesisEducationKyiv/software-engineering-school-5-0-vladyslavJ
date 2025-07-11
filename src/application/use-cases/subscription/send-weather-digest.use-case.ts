import { injectable, inject } from 'tsyringe';
import { format } from 'date-fns';
import { TOKENS } from '../../../infrastructure/di/di-tokens';
import { ISubscriptionRepository } from '../../../domain/ports/repositories/subscription-repository.port';
import { IEmailPort } from '../../../domain/ports/notification/email.port';
import { IWeatherInputPort } from '../../ports/weather.port';
import { ILogger } from '../../../shared/interfaces/logger-service.interface';
import { digestTpl } from '../../../shared/utils/email-templates.util';
import { SubscriptionFrequencyEnum } from '../../../shared/enums/subscription-frequency.enum';
import { WeatherDto } from '../../../shared/dtos/weather.dto';

@injectable()
export class SendWeatherDigestUseCase {
  constructor(
    @inject(TOKENS.ISubscriptionRepository)
    private readonly subscriptionRepository: ISubscriptionRepository,
    @inject(TOKENS.IWeatherInputPort) private readonly weatherUseCase: IWeatherInputPort,
    @inject(TOKENS.IEmailPort) private readonly emailPort: IEmailPort,
    @inject(TOKENS.ILogger) private readonly logger: ILogger,
  ) {}

  async sendDigest(frequency: SubscriptionFrequencyEnum): Promise<void> {
    this.logger.info(`[JOB] Starting ${frequency} weather digest...`);
    const subscriptions = await this.subscriptionRepository.findConfirmedByFrequency(frequency);

    if (subscriptions.length === 0) {
      this.logger.info(`[JOB] No subscriptions found for ${frequency} digest.`);
      return;
    }

    this.logger.info(`[JOB] Found ${subscriptions.length} subscriptions for ${frequency} digest.`);

    const processingTasks = subscriptions.map(async sub => {
      try {
        const weather = await this.weatherUseCase.getWeather(sub.city);
        const weatherDto = new WeatherDto(weather);

        await this.emailPort.send({
          to: sub.email,
          ...digestTpl(
            sub.city,
            weatherDto,
            format(new Date(), 'dd.MM.yyyy HH:mm'),
            sub.unsubscribe_token,
          ),
        });
        this.logger.info(`[JOB] Sent digest to ${sub.email} for ${sub.city}`);
      } catch (err) {
        this.logger.error(`[JOB] Failed to send digest to ${sub.email}:`, err);
      }
    });

    await Promise.allSettled(processingTasks);
    this.logger.info(`[JOB] Finished ${frequency} weather digest.`);
  }
}
