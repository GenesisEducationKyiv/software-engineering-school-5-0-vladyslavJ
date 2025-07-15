import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/di-tokens';
import { ISubscriptionRepository } from '../../../domain/ports/repositories/subscription-repository.port';
import { IEmailPort } from '../../../domain/ports/notification/email.port';
import { HttpError } from '../../../shared/utils/custom-error.util';
import { ILogger } from '../../../shared/interfaces/logger-service.interface';
import { confirmedTpl } from '../../../shared/utils/email-templates.util';
import { QueryFailedError } from 'typeorm';

@injectable()
export class ConfirmSubscriptionUseCase {
  constructor(
    @inject(TOKENS.ISubscriptionRepository)
    private readonly subscriptionRepository: ISubscriptionRepository,
    @inject(TOKENS.IEmailPort) private readonly email: IEmailPort,
    @inject(TOKENS.ILogger) private readonly logger: ILogger,
  ) {}

  async confirm(rawToken: string) {
    const token = rawToken.trim();
    this.logger.info(`Confirm token: ${token}`);

    let sub;
    try {
      sub = await this.subscriptionRepository.findByToken(token, 'confirmation_token');
    } catch (err) {
      if (err instanceof QueryFailedError) throw new HttpError('Invalid token format', 400);
      throw err;
    }

    if (!sub) throw new HttpError('Token not found', 404);
    if (sub.confirmed) return;

    await this.subscriptionRepository.confirm(sub);
    await this.email.send({
      to: sub.email,
      ...confirmedTpl(sub.email, sub.city, sub.frequency, sub.unsubscribe_token),
    });
    this.logger.info(`Subscription confirmed: email=${sub.email}`);
  }
}
