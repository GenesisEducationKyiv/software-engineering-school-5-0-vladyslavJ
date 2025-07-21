import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { WeatherService } from '../../../../application/services/weather.service';
import { HttpException } from '@nestjs/common';

@Controller()
export class WeatherGrpcController {
  constructor(private readonly weatherService: WeatherService) {}

  @GrpcMethod('WeatherService', 'GetWeather')
  async getWeather(req: { city: string }) {
    try {
      return await this.weatherService.getWeather(req.city);
    } catch (error) {
      if (error instanceof HttpException && error.getStatus() === 404) {
        throw new RpcException({
          code: 5,
          message: error.message,
        });
      }
      if (error instanceof HttpException && error.getStatus() === 400) {
        throw new RpcException({
          code: 3,
          message: error.message,
        });
      }
      if (error instanceof Error) {
        throw new RpcException({
          code: 14,
          message: error.message,
        });
      }
      throw new RpcException({
        code: 13,
        message: 'Internal server error',
      });
    }
  }
}
