import { Module } from '@nestjs/common';
import { HttpClient } from './http-client.service';
import { HttpDiTokens } from './di/di-tokens';

@Module({
  providers: [
    {
      provide: HttpDiTokens.HTTP_CLIENT,
      useClass: HttpClient,
    },
  ],
  exports: [HttpDiTokens.HTTP_CLIENT],
})
export class HttpClientModule {}
