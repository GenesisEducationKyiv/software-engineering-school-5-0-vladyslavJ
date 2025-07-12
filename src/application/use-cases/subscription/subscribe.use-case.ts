import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/di-tokens';
import { ISubscriptionRepository } from '../../../domain/ports/repositories/subscription-repository.port';
import { IEmailPort } from '../../../domain/ports/notification/email.port';
import { SubscriptionFrequency } from '../../../shared/enums/subscription-frequency.enum';
import { HttpError } from '../../../shared/utils/custom-error.util';
import { genToken } from '../../../shared/utils/gen-token.util';
import { confirmTpl } from '../../../shared/utils/email-templates.util';
import { ILogger } from '../../../shared/interfaces/logger-service.interface';

@injectable()
export class SubscribeUseCase {
  constructor(
    @inject(TOKENS.ISubscriptionRepository)
    private readonly subscriptionRepository: ISubscriptionRepository,
    @inject(TOKENS.IEmailPort) private readonly email: IEmailPort,
    @inject(TOKENS.ILogger) private readonly logger: ILogger,
  ) {}

  async subscribe(email: string, city: string, frequency: SubscriptionFrequency): Promise<void> {
    this.logger.info(`Trying to subscribe: email=${email}, city=${city}, frequency=${frequency}`);

    if (await this.subscriptionRepository.findExisting(email, city, frequency)) {
      this.logger.warn(`Subscription already exists`);
      throw new HttpError('Email already subscribed', 409);
    }

    const confirmation_token = genToken();
    const unsubscribe_token = genToken();

    await this.subscriptionRepository.save({
      email,
      city,
      frequency,
      confirmation_token,
      unsubscribe_token,
    });

    this.logger.info(`Subscription created & confirmation email sent`);
    await this.email.send({ to: email, ...confirmTpl(confirmation_token) });
  }
}
