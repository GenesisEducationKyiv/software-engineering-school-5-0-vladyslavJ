import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GrpcToObservable } from '../../../../../libs/common/types/observable';
import { ISubscriptionServiceClient } from './interfaces/subscription-client.interface';
import { SubscriptionDto } from '../subscription/dtos/subscription.dto';
import { Token } from './interfaces/token.type';
import { Empty } from '../../../../../libs/common/types/empty.type';

@Injectable()
export class SubscriptionServiceClient implements OnModuleInit, ISubscriptionServiceClient {
  constructor(@Inject('SUBSCRIPTION_PACKAGE') private readonly client: ClientGrpc) {}
  private serviceClient!: GrpcToObservable<ISubscriptionServiceClient>;

  onModuleInit() {
    this.serviceClient =
      this.client.getService<GrpcToObservable<ISubscriptionServiceClient>>('SubscriptionService');
  }

  subscribe(req: SubscriptionDto): Promise<Token> {
    return lastValueFrom(this.serviceClient.subscribe(req));
  }

  confirm(req: Token): Promise<Empty> {
    return lastValueFrom(this.serviceClient.confirm(req));
  }

  unsubscribe(req: Token): Promise<Empty> {
    return lastValueFrom(this.serviceClient.unsubscribe(req));
  }
}
