import { Injectable, Inject } from '@nestjs/common';
import { SubscriptionRepositoryInterface } from '../../domain/ports/repositories/subscription-repository.port';
import { SubscriptionFrequency } from '../../../../libs/common/enums/subscription-frequency.enum';
import { SubscriptionModel } from '../../../../libs/common/models/subscription.model';
import { SubscriptionRepoDiTokens } from '../../infrastructure/database/di/di-tokens';
import { LoggerDiTokens } from '../../../../libs/modules/logger/di/di-tokens';
import { LoggerInterface } from '../../../../libs/modules/logger/interfaces/logger.interface';

@Injectable()
export class GetSubscribersByFrequencyUseCase {
  constructor(
    @Inject(SubscriptionRepoDiTokens.SUBSCRIPTION_REPOSITORY)
    private readonly repo: SubscriptionRepositoryInterface,
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: LoggerInterface,
  ) {
    this.logger.setContext(GetSubscribersByFrequencyUseCase.name);
  }

  async getByFrequency(req: SubscriptionFrequency): Promise<SubscriptionModel[]> {
    this.logger.info(`getByFrequency called for: ${req}`);
    try {
      return await this.repo.findConfirmedByFrequency(req);
    } catch (error) {
      this.logger.error('Error getting subscribers by frequency', error);
      throw error;
    }
  }
}
