import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GrpcToObservable } from '../../../../../../libs/common/types/observable';
import { SubscriptionServiceClientInterface } from './interfaces/subscription-client.interface';
import { SubscriptionDto } from '../../../../../../libs/common/dtos/subscription.dto';
import { Token } from './interfaces/token.type';
import { Empty } from '../../../../../../libs/common/types/empty.type';
import { GrpcClientDiTokens } from '../../../../../../libs/common/di/grpc-client-di-tokens';

@Injectable()
export class SubscriptionServiceClient implements OnModuleInit, SubscriptionServiceClientInterface {
  constructor(@Inject(GrpcClientDiTokens.SUBSCRIPTION_SERVICE_GRPC_CLIENT) private readonly client: ClientGrpc) {}
  private serviceClient!: GrpcToObservable<SubscriptionServiceClientInterface>;

  onModuleInit() {
    this.serviceClient =
      this.client.getService<GrpcToObservable<SubscriptionServiceClientInterface>>(
        'SubscriptionService',
      );
  }

  async subscribe(req: SubscriptionDto): Promise<Empty> {
    return lastValueFrom(this.serviceClient.subscribe(req));
  }

  async confirm(req: { token: Token }): Promise<Empty> {
    return lastValueFrom(this.serviceClient.confirm(req));
  }

  async unsubscribe(req: { token: Token }): Promise<Empty> {
    return lastValueFrom(this.serviceClient.unsubscribe(req));
  }
}
