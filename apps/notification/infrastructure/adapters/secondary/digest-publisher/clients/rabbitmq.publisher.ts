import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { RABBITMQ_URL, DIGEST_QUEUE } from '../../../../../../../libs/config/rabbitmq.config';
import { Notification } from '../../../../../../../libs/common/types/notification-request.type';
import { DigestPublisherInterface } from '../interfaces/digest-publisher.interface';
import { Empty } from '../../../../../../../libs/common/types/empty.type';
import { firstValueFrom } from 'rxjs';
import { LoggerDiTokens } from '../../../../../../../libs/modules/logger/di/di-tokens';
import { LoggerInterface } from '../../../../../../../libs/modules/logger/interfaces/logger.interface';

@Injectable()
export class RabbitmqDigestPublisher implements DigestPublisherInterface {
  private client: ClientProxy;

  constructor(
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: LoggerInterface,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [RABBITMQ_URL],
        queue: DIGEST_QUEUE,
        queueOptions: { durable: true },
      },
    });
    this.logger.setContext(RabbitmqDigestPublisher.name);
  }

  async publishDigest(digest: Notification): Promise<Empty> {
    this.logger.info(`publishDigest called for: ${digest.email}`);
    try {
      await firstValueFrom(this.client.emit('digest.ready', digest));
    } catch (error) {
      this.logger.error('Error publishing digest to RabbitMQ', error);
      throw error;
    }
    return {};
  }
}
