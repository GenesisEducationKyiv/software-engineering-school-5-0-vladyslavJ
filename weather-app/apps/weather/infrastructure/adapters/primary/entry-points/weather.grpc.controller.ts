import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { WeatherService } from '../../../../application/services/weather.service';
import { WeatherMicroserviceInterface } from '../../../../../../libs/common/interfaces/weather-microservice.interface';

@Controller()
export class WeatherGrpcController implements WeatherMicroserviceInterface{
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
