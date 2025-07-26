import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GrpcToObservable } from '../../../../../libs/common/types/observable';
import { ISubscriptionServiceClient } from './interfaces/subscription-client.interface';
import { SubscriptionDto } from '../../../../../libs/common/dtos/subscription.dto';
import { Token } from './interfaces/token.type';
import { PackageNames } from '../../common/utils/enums/package-names.enum';
import { SubscribeResponseInterface } from './interfaces/subscribe-response.interface';
import { ConfirmResponseInterface } from './interfaces/confirmed-subscription.interface';
import { UnsubscribeResponseInterface } from './interfaces/unsubscrube-response.interface';
import { Subscription } from '../../../../../libs/common/models/subscription.entity';
import { SubscriptionFrequency } from '../../../../../libs/common/enums/subscription-frequency.enum';

@Injectable()
export class SubscriptionServiceClient implements OnModuleInit, ISubscriptionServiceClient {
  constructor(@Inject(PackageNames.SUBSCRIPTION_PACKAGE) private readonly client: ClientGrpc) {}
  private serviceClient!: GrpcToObservable<ISubscriptionServiceClient>;

  onModuleInit() {
    this.serviceClient =
      this.client.getService<GrpcToObservable<ISubscriptionServiceClient>>('SubscriptionService');
  }

  async subscribe(req: SubscriptionDto): Promise<SubscribeResponseInterface> {
    console.log(`[SUB-CLIENT] ${req}`);
    return lastValueFrom(this.serviceClient.subscribe(req));
  }

  async confirm(req: { token: Token }): Promise<ConfirmResponseInterface> {
    return lastValueFrom(this.serviceClient.confirm(req));
  }

  async unsubscribe(req: { token: Token }): Promise<UnsubscribeResponseInterface> {
    return lastValueFrom(this.serviceClient.unsubscribe(req));
  }

  async getByFrequency(frequency: SubscriptionFrequency): Promise<Subscription[]> {
    return lastValueFrom(this.serviceClient.getByFrequency(frequency));
  }
}
