import { injectable, inject } from 'tsyringe';
import { ISubscriptionInputPort } from '../ports/subscription.port';
import { SubscribeUseCase } from '../use-cases/subscription/subscribe.use-case';
import { ConfirmSubscriptionUseCase } from '../use-cases/subscription/confirm-subscription.use-case';
import { UnsubscribeUseCase } from '../use-cases/subscription/unsubscribe.use-case';
import { SendWeatherDigestUseCase } from '../use-cases/subscription/send-weather-digest.use-case';
import { SubscriptionFrequency } from '../../shared/enums/subscription-frequency.enum';

@injectable()
export class SubscriptionService implements ISubscriptionInputPort {
  constructor(
    @inject(SubscribeUseCase) private subscribeUseCase: SubscribeUseCase,
    @inject(ConfirmSubscriptionUseCase)
    private confirmSubscriptionUseCase: ConfirmSubscriptionUseCase,
    @inject(UnsubscribeUseCase) private unsubscribeUseCase: UnsubscribeUseCase,
    @inject(SendWeatherDigestUseCase) private sendWeatherDigestUseCase: SendWeatherDigestUseCase,
  ) {}

  async subscribe(email: string, city: string, frequency: SubscriptionFrequency): Promise<void> {
    return this.subscribeUseCase.subscribe(email, city, frequency);
  }

  async confirm(token: string): Promise<void> {
    return this.confirmSubscriptionUseCase.confirm(token);
  }

  async unsubscribe(token: string): Promise<void> {
    return this.unsubscribeUseCase.unsubscribe(token);
  }

  async sendDigest(frequency: SubscriptionFrequency): Promise<void> {
    return this.sendWeatherDigestUseCase.sendDigest(frequency);
  }
}
