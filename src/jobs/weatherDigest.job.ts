import { format } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import { WeatherService } from '../services/weather.service';
import { ISubscriptionRepository } from '../repositories/subscription.repository';
import { IMailService } from '../services/mail.service';
import { digestTpl } from '../utils/templates';
import { logger } from '../utils/logger';
import { TOKENS } from '../config/di.tokens';

enum SubscriptionFrequency {
  Hourly = 'hourly',
  Daily = 'daily',
}

@injectable()
export class WeatherDigestJob {
  constructor(
    @inject(TOKENS.WeatherService) private readonly weatherService: WeatherService,
    @inject(TOKENS.IMailService) private readonly mail: IMailService,
    @inject(TOKENS.ISubscriptionRepository)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  private async process(frequency: SubscriptionFrequency) {
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
          logger.error('[JOB] email send error', err);
        }
      }),
    );
  }

  runHourly = () => this.process(SubscriptionFrequency.Hourly);
  runDaily = () => this.process(SubscriptionFrequency.Daily);
}
