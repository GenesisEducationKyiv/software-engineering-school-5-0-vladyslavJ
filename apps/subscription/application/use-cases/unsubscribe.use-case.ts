import { Injectable, Inject } from '@nestjs/common';
import { NotificationServiceClientInterface } from '../../infrastructure/adapters/secondary/notification/interfaces/notification-client.interface';
import { NotificationServiceClientDiTokens } from '../../../../libs/common/di/notification-di-tokens';
import { LoggerDiTokens } from '../../../../libs/modules/logger/di/di-tokens';
import { LoggerInterface } from '../../../../libs/modules/logger/interfaces/logger.interface';
import { SubscriptionRepositoryInterface } from '../../domain/ports/repositories/subscription-repository.port';
import { Empty } from '../../../../libs/common/types/empty.type';
import { RpcException } from '@nestjs/microservices';
import { GrpcCode } from '../../../../libs/common/enums/grpc-codes.enum';
import { EmailType } from '../../../../libs/common/enums/email-type.enum';
import { SubscriptionRepoDiTokens } from '../../infrastructure/database/di/di-tokens';
import { QueryFailedError } from 'typeorm';
import { SubscriptionField } from '../../../../libs/common/types/subscription-fields.type';

@Injectable()
export class UnsubscribeUseCase {
  constructor(
    @Inject(SubscriptionRepoDiTokens.SUBSCRIPTION_REPOSITORY)
    private readonly repo: SubscriptionRepositoryInterface,
    @Inject(NotificationServiceClientDiTokens.NOTIFICATION_SERVICE_CLIENT)
    private readonly notificationClient: NotificationServiceClientInterface,
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: LoggerInterface,
  ) {
    this.logger.setContext(UnsubscribeUseCase.name);
  }

  async unsubscribe(unsubscriptionToken: string): Promise<Empty> {
    const token = unsubscriptionToken.trim();
    this.logger.info(`Try to unsubscribe token: ${token}`);

    let subscriber;
    try {
      subscriber = await this.repo.findByToken(token, SubscriptionField.UNSUBSCRIBE_TOKEN);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new RpcException({
          code: GrpcCode.INVALID_ARGUMENT,
          message: 'Invalid token format',
        });
      }
      throw new RpcException({
        code: GrpcCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    }

    if (!subscriber) {
      throw new RpcException({ code: GrpcCode.NOT_FOUND, message: 'Token not found' });
    }

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
