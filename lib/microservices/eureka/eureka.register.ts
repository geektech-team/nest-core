import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Eureka } from 'eureka-js-client';

@Injectable()
export class EurekaRegister
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  @Inject()
  private readonly eureka: Eureka;

  async onApplicationBootstrap() {
    if (!this.eureka) {
      return;
    }
    this.eureka.start();
  }

  async onApplicationShutdown() {
    if (!this.eureka) {
      return;
    }
    this.eureka.stop();
  }
}
