import { Injectable } from '@nestjs/common';
import { SubscriptionInputPortInterface } from '../ports/subscription.port';
import { SubscriptionDto } from '../../../../libs/common/dtos/subscription.dto';
import { Token } from '../../../../libs/common/types/token.type';
import { SubscribeUseCase } from '../use-cases/subscribe.use-case';
import { ConfirmSubscriptionUseCase } from '../use-cases/confirm-subscription.use-case';
import { UnsubscribeUseCase } from '../use-cases/unsubscribe.use-case';
import { SubscriptionFrequency } from '../../../../libs/common/enums/subscription-frequency.enum';
import { GetSubscribersByFrequencyUseCase } from '../use-cases/get-subscribers-by-frequency.use-case';
import { Empty } from '../../../../libs/common/types/empty.type';
import { SubscriptionModel } from '../../../../libs/common/models/subscription.model';

@Injectable()
export class SubscriptionService implements SubscriptionInputPortInterface {
  constructor(
    private readonly subscribeUseCase: SubscribeUseCase,
    private readonly confirmSubscriptionUseCase: ConfirmSubscriptionUseCase,
    private readonly unsubscribeUseCase: UnsubscribeUseCase,
    private readonly getSubscribersByFrequencyUseCase: GetSubscribersByFrequencyUseCase,
  ) {}

  async subscribe(data: SubscriptionDto): Promise<Empty> {
    return this.subscribeUseCase.subscribe(data);
  }

  async confirm(token: Token): Promise<Empty> {
    return this.confirmSubscriptionUseCase.confirm(token);
  }

  async unsubscribe(token: Token): Promise<Empty> {
    return this.unsubscribeUseCase.unsubscribe(token);
  }

  async getByFrequency(frequency: SubscriptionFrequency): Promise<SubscriptionModel[]> {
    return this.getSubscribersByFrequencyUseCase.getByFrequency(frequency);
  }
}
