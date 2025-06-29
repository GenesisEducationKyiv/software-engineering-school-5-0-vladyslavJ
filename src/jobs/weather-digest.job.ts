import { format } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import { WeatherService } from '../services/weather.service';
import { ISubscriptionRepository } from '../interfaces/subscription-repository.interface';
import { IEmailService } from '../interfaces/email-service.interface';
import { digestTpl } from '../utils/email-templates.util';
import { ILogger } from '../interfaces/logger-service.interface';
import { TOKENS } from '../config/di-tokens.config';
import { SubscriptionFrequencyEnum } from '../enums/subscription-frequency.enum';

@injectable()
export class WeatherDigestJob {
  constructor(
    @inject(TOKENS.WeatherService) private readonly weatherService: WeatherService,
    @inject(TOKENS.IEmailService) private readonly mail: IEmailService,
    @inject(TOKENS.ISubscriptionRepository)
    private readonly subscriptionRepository: ISubscriptionRepository,
    @inject(TOKENS.ILogger) private readonly logger: ILogger,
  ) {}

  private async process(frequency: SubscriptionFrequencyEnum) {
    const subs = await this.subscriptionRepository.findConfirmedByFrequency(frequency);

    await Promise.allSettled(
      subs.map(async sub => {
        try {
          const weather = await this.weatherService.getWeather(sub.city);
          await this.mail.send({
            to: sub.email,
            ...digestTpl(
              sub.city,
              weather,
              format(new Date(), 'dd.MM.yyyy HH:mm'),
              sub.unsubscribe_token,
            ),
          });
        } catch (err) {
          this.logger.error('[JOB] email send error', err);
        }
      }),
    );
  }

  runHourly = () => this.process(SubscriptionFrequencyEnum.HOURLY);
  runDaily = () => this.process(SubscriptionFrequencyEnum.DAILY);
}
