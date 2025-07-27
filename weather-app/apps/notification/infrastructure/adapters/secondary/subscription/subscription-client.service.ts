import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcToObservable } from '../../../../../../libs/common/types/observable';
import { lastValueFrom } from 'rxjs';
import { GrpcClientDiTokens } from '../../../../../../libs/common/di/grpc-client-di-tokens';
import { SubscriptionServiceClientInterface } from './interfaces/subscription-client.interface';
import { SubscriptionDto } from '../../../../../../libs/common/dtos/subscription.dto';
import { Empty } from '../../../../../../libs/common/types/empty.type';
import { Token } from '../../../../../../libs/common/types/token.type';
import { Subscription } from '../../../../../../libs/common/models/subscription.entity';
import { SubscriptionFrequency } from '../../../../../../libs/common/enums/subscription-frequency.enum';

@Injectable()
export class SubscriptionServiceClient implements OnModuleInit, SubscriptionServiceClientInterface {
  constructor(
    @Inject(GrpcClientDiTokens.SUBSCRIPTION_SERVICE_GRPC_CLIENT)
    private readonly client: ClientGrpc,
  ) {}
  private serviceClient!: GrpcToObservable<SubscriptionServiceClientInterface>;

  onModuleInit() {
    this.serviceClient =
      this.client.getService<GrpcToObservable<SubscriptionServiceClientInterface>>(
        'SubscriptionService',
      );
  }

  async subscribe(dto: SubscriptionDto): Promise<Empty> {
    return lastValueFrom(this.serviceClient.subscribe(dto));
  }

  async confirm(req: { token: Token }): Promise<Empty> {
    return lastValueFrom(this.serviceClient.confirm(req));
  }

  async unsubscribe(req: { token: Token }): Promise<Empty> {
    return lastValueFrom(this.serviceClient.unsubscribe(req));
  }

  async getByFrequency(frequency: SubscriptionFrequency): Promise<Subscription[]> {
    return lastValueFrom(this.serviceClient.getByFrequency(frequency));
  }
}
