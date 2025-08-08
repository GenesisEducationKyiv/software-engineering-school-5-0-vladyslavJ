import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { GrpcToObservable } from '../../../../../../libs/common/types/observable';
import { SubscriptionServiceClientInterface } from './interfaces/subscription-client.interface';
import { SubscriptionDto } from '../../../../../../libs/common/dtos/subscription.dto';
import { Token } from '../../../../../../libs/common/types/token.type';
import { Empty } from '../../../../../../libs/common/types/empty.type';
import { GrpcClientDiTokens } from '../../../../../../libs/common/di/grpc-client-di-tokens';
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

  async subscribe(req: SubscriptionDto): Promise<Empty> {
    this.logger.info('subscribe called');
    return firstValueFrom(this.serviceClient.subscribe(req));
  }

  async confirm(req: { token: Token }): Promise<Empty> {
    this.logger.info('confirm called');
    return firstValueFrom(this.serviceClient.confirm(req));
  }

  async unsubscribe(req: { token: Token }): Promise<Empty> {
    this.logger.info('unsubscribe called');
    return firstValueFrom(this.serviceClient.unsubscribe(req));
  }
}
