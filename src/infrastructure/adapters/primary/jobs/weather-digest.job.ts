import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../../infrastructure/di/di-tokens';
import { ILogger } from '../../../../shared/interfaces/logger-service.interface';
import { SubscriptionFrequency } from '../../../../shared/enums/subscription-frequency.enum';
import { ISubscriptionInputPort } from '../../../../application/ports/subscription.port';

@injectable()
export class WeatherDigestJob {
  constructor(
    @inject(TOKENS.ISubscriptionInputPort)
    private readonly subscriptionService: ISubscriptionInputPort,
    @inject(TOKENS.ILogger) private readonly logger: ILogger,
  ) {}

  public runHourly = async (): Promise<void> => {
    try {
      await this.subscriptionService.sendDigest(SubscriptionFrequency.HOURLY);
    } catch (err) {
      this.logger.error('[JOB] Unhandled error in hourly digest', err);
    }
  };

  public runDaily = async (): Promise<void> => {
    try {
      await this.subscriptionService.sendDigest(SubscriptionFrequency.DAILY);
    } catch (err) {
      this.logger.error('[JOB] Unhandled error in daily digest', err);
    }
  };
}
