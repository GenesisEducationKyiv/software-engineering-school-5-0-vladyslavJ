import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcToObservable } from '../../../../../../libs/common/types/observable';
import { firstValueFrom } from 'rxjs';
import { GrpcClientDiTokens } from '../../../../../../libs/common/di/grpc-client-di-tokens';
import { SubscriptionServiceClientInterface } from './interfaces/subscription-client.interface';
import { SubscriptionDto } from '../../../../../../libs/common/dtos/subscription.dto';
import { Empty } from '../../../../../../libs/common/types/empty.type';
import { Token } from '../../../../../../libs/common/types/token.type';
import { SubscriptionFrequency } from '../../../../../../libs/common/enums/subscription-frequency.enum';
import { SubscriptionModel } from '../../../../../../libs/common/models/subscription.model';
import { LoggerDiTokens } from '../../../../../../libs/modules/logger/di/di-tokens';
import { LoggerInterface } from '../../../../../../libs/modules/logger/interfaces/logger.interface';
import { GRPC_SERVICES } from '../../../../../../libs/common/constants/grpc-service.const';
@Injectable()
export class SubscriptionServiceClient implements OnModuleInit, SubscriptionServiceClientInterface {
  constructor(
    @Inject(GrpcClientDiTokens.SUBSCRIPTION_SERVICE_GRPC_CLIENT)
    private readonly client: ClientGrpc,
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: LoggerInterface,
  ) {}
  private serviceClient!: GrpcToObservable<SubscriptionServiceClientInterface>;

  onModuleInit() {
    this.serviceClient = this.client.getService<
      GrpcToObservable<SubscriptionServiceClientInterface>
    >(GRPC_SERVICES.SUBSCRIPTION);
    this.logger.setContext(SubscriptionServiceClient.name);
    this.logger.info('gRPC SubscriptionServiceClient initialized');
  }

  async subscribe(dto: SubscriptionDto): Promise<Empty> {
    this.logger.info('subscribe called');
    try {
      return await firstValueFrom(this.serviceClient.subscribe(dto));
    } catch (error) {
      this.logger.error('Error subscribing', error);
      throw error;
    }
  }

  async confirm(req: { token: Token }): Promise<Empty> {
    this.logger.info('confirm called');
    try {
      return await firstValueFrom(this.serviceClient.confirm(req));
    } catch (error) {
      this.logger.error('Error confirming subscription', error);
      throw error;
    }
  }

  async unsubscribe(req: { token: Token }): Promise<Empty> {
    this.logger.info('unsubscribe called');
    try {
      return await firstValueFrom(this.serviceClient.unsubscribe(req));
    } catch (error) {
      this.logger.error('Error unsubscribing', error);
      throw error;
    }
  }

  async getByFrequency(data: {
    frequency: SubscriptionFrequency;
  }): Promise<{ subscriptions: SubscriptionModel[] }> {
    this.logger.info(`getByFrequency called for: ${data.frequency}`);
    try {
      const raw = await firstValueFrom(this.serviceClient.getByFrequency(data));
      const subscriptions = Array.isArray(raw?.subscriptions) ? raw.subscriptions : [];
      return { subscriptions };
    } catch (error) {
      this.logger.error('Error getting subscriptions by frequency', error);
      throw error;
    }
  }
}
