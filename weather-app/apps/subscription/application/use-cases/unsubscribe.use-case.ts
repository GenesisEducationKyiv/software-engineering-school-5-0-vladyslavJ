import { Injectable, Inject } from '@nestjs/common';
import { NotificationServiceClientInterface } from '../../../api-gateway/src/modules/notification-client/interfaces/notification-client.interface';
import { NotificationServiceClientDiTokens } from '../../../../libs/common/di/notification-di-tokens';
import { LoggerDiTokens } from '../../../../libs/modules/logger/di/di-tokens';
import { ILogger } from '../../../../libs/modules/logger/interfaces/logger.interface';
import { SubscriptionRepositoryInterface } from '../../domain/ports/repositories/subscription-repository.port';
import { Empty } from '../../../../libs/common/types/empty.type';
import { RpcException } from '@nestjs/microservices';
import { GrpcCode } from '../../../../libs/common/enums/grpc-codes.enum';
import { EmailType } from '../../../../libs/common/enums/email-type.enum';
import { SubscriptionRepoDiTokens } from '../../infrastructure/database/di/di-tokens';

@Injectable()
export class UnsubscribeUseCase {
  constructor(
    @Inject(SubscriptionRepoDiTokens.SUBSCRIPTION_REPOSITORY)
    private readonly repo: SubscriptionRepositoryInterface,
    @Inject(NotificationServiceClientDiTokens.NOTIFICATION_SERVICE_GRPC_CLIENT)
    private readonly notificationClient: NotificationServiceClientInterface,
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: ILogger,
  ) {}

  async unsubscribe(unsubscriptionToken: string): Promise<Empty> {
    const token = unsubscriptionToken.trim();
    this.logger.info(`Try to unsubscribe token: ${token}`);

    const subscriber = await this.repo.findByToken(token, 'unsubscribe_token');
    if (!subscriber)
      throw new RpcException({ code: GrpcCode.NOT_FOUND, message: 'Token not found' });

    await this.notificationClient.sendNotification({
      type: EmailType.UNSUBSCRIPTION_GOODBYE,
      email: subscriber.email,
      data: { city: subscriber.city },
    });
    
    await this.repo.remove(subscriber);
    this.logger.info(`Subscription removed: email=${subscriber.email}`);

    return {};
  }
}
