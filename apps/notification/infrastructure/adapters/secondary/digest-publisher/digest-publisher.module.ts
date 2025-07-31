import { Module } from '@nestjs/common';
import { RabbitmqDigestPublisher } from './clients/rabbitmq.publisher';
import { DigestServiceDiTokens } from './di/digest-publisher-di-tokens';

@Module({
  providers: [
    {
      provide: DigestServiceDiTokens.DIGEST_PUBLISHER,
      useClass: RabbitmqDigestPublisher,
    },
  ],
  exports: [DigestServiceDiTokens.DIGEST_PUBLISHER],
})
export class DigestPublisherModule {}
