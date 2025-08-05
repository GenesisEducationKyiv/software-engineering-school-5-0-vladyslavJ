import { Injectable, Inject } from '@nestjs/common';
import { SubscriptionRepositoryInterface } from '../../domain/ports/repositories/subscription-repository.port';
import { SubscriptionFrequency } from '../../../../libs/common/enums/subscription-frequency.enum';
import { SubscriptionModel } from '../../../../libs/common/models/subscription.model';
import { SubscriptionRepoDiTokens } from '../../infrastructure/database/di/di-tokens';

@Injectable()
export class GetSubscribersByFrequencyUseCase {
  constructor(
    @Inject(SubscriptionRepoDiTokens.SUBSCRIPTION_REPOSITORY)
    private readonly repo: SubscriptionRepositoryInterface,
  ) {}

  async getByFrequency(req: SubscriptionFrequency): Promise<SubscriptionModel[]> {
    return await this.repo.findConfirmedByFrequency(req);
  }
}
