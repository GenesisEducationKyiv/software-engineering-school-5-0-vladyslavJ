import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { RABBITMQ_URL, DIGEST_QUEUE } from '../../../../../../../libs/config/rabbitmq.config';
import { Notification } from '../../../../../../../libs/common/types/notification-request.type';
import { DigestPublisherInterface } from '../interfaces/digest-publisher.interface';
import { Empty } from '../../../../../../../libs/common/types/empty.type';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RabbitmqDigestPublisher implements DigestPublisherInterface {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [RABBITMQ_URL],
        queue: DIGEST_QUEUE,
        queueOptions: { durable: true },
      },
    });
  }

  async publishDigest(digest: Notification): Promise<Empty> {
    await firstValueFrom(this.client.emit('digest.ready', digest));
    return {};
  }
}
