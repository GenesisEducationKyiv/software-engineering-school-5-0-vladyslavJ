import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { WeatherService } from '../../../../application/services/weather.service';

@Controller()
export class WeatherGrpcController {
  constructor(private readonly weatherService: WeatherService) {}

  @GrpcMethod('WeatherService', 'GetWeather')
  async getWeather(req: { city: string }) {
    try {
      return await this.weatherService.getWeather(req.city);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        code: 13,
        message: 'Internal server error',
      });
    }
  }
}
