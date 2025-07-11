import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/di-tokens';
import { ISubscriptionRepository } from '../../../domain/ports/repositories/subscription-repository.port';
import { IEmailPort } from '../../../domain/ports/notification/email.port';
import { HttpError } from '../../../shared/utils/custom-error.util';
import { ILogger } from '../../../shared/interfaces/logger-service.interface';
import { goodbyeTpl } from '../../../shared/utils/email-templates.util';

@injectable()
export class UnsubscribeUseCase {
  constructor(
    @inject(TOKENS.ISubscriptionRepository)
    private readonly subscriptionRepository: ISubscriptionRepository,
    @inject(TOKENS.IEmailPort) private readonly email: IEmailPort,
    @inject(TOKENS.ILogger) private readonly logger: ILogger,
  ) {}

  async unsubscribe(token: string) {
    this.logger.info(`Unsubscribe token: ${token}`);

    const sub = await this.subscriptionRepository.findByToken(token, 'unsubscribe_token');
    if (!sub) throw new HttpError('Token not found', 404);

    await this.email.send({ to: sub.email, ...goodbyeTpl(sub.city) });
    await this.subscriptionRepository.remove(sub);
    this.logger.info(`Subscription removed: email=${sub.email}`);
  }
}
