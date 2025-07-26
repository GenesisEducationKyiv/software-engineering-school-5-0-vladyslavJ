import { Injectable, Inject } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { QueryFailedError } from 'typeorm';
import { SubscriptionRepositoryInterface } from '../../domain/ports/repositories/subscription-repository.port';
import { LoggerDiTokens } from '../../../../libs/modules/logger/di/di-tokens';
import { ILogger } from '../../../../libs/modules/logger/interfaces/logger.interface';
import { GrpcCode } from '../../../../libs/common/enums/grpc-codes.enum';
import { INotificationServiceClient } from '../../../api-gateway/src/modules/notification-client/interfaces/notification-client.interface';
import { NotificationServiceClientDiTokens } from '../../../../libs/common/di/notification-di-tokens';
import { EmailType } from '../../../../libs/common/enums/email-type.enum';
import { Empty } from '../../../../libs/common/types/empty.type';
import { SubscriptionRepoDiTokens } from '../../infrastructure/database/di/di-tokens';

@Injectable()
export class ConfirmSubscriptionUseCase {
  constructor(
    @Inject(SubscriptionRepoDiTokens.SUBSCRIPTION_REPOSITORY)
    private readonly repo: SubscriptionRepositoryInterface,
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: ILogger,
    @Inject(NotificationServiceClientDiTokens.NOTIFICATION_SERVICE_GRPC_CLIENT)
    private readonly notificationClient: INotificationServiceClient,
  ) {}

  async confirm(confirmationToken: string): Promise<Empty> {
    const token = confirmationToken.trim();
    this.logger.info(`Confirm token: ${token}`);

    let subscriber;
    try {
      subscriber = await this.repo.findByToken(token, 'confirmation_token');
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
    if (subscriber.confirmed) {
      throw new RpcException({ code: GrpcCode.ALREADY_EXISTS, message: 'Token already confirmed' });
    }

    await this.repo.confirm(subscriber);

    await this.notificationClient.sendNotification({
      type: EmailType.CONFIRMED_SUBSCRIPTION,
      email: subscriber.email,
      data: {
        city: subscriber.city,
        frequency: subscriber.frequency,
        unsubscribeToken: subscriber.unsubscribe_token,
      },
    });
    this.logger.info(`Subscription confirmed: sub=${subscriber.email}`);

    return {};
  }
}
