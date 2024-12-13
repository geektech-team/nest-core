import { Inject, Injectable } from '@nestjs/common';
import { EurekaClient, Eureka } from 'eureka-js-client';
import { logger } from '../../logger';


@Injectable()
export class EurekaDiscovery {
  @Inject()
  private readonly eureka: Eureka;

  getServiceAddress(serviceName: string) {
    const instances: EurekaClient.EurekaInstanceConfig[] =
      this.eureka.getInstancesByAppId(serviceName);
    if (!instances || !instances.length) {
      logger.error(`eureka中没有服务: ${serviceName}`);
      return null;
    }
    const instance = instances.find((value) => value['status'] === 'UP');
    if (!instance) {
      logger.error(`eureka中没有在线的服务: ${serviceName}`);
      return null;
    }
    const host = instance.hostName;
    const port = this.getPort(instance);
    return `${host}:${port}`;
  }

  private getPort(instance: EurekaClient.EurekaInstanceConfig): number {
    if (typeof instance.port === 'number') {
      return instance.port;
    } else if (
      instance.port.hasOwnProperty('enabled') &&
      (instance.port as EurekaClient.PortWrapper).enabled
    ) {
      return (instance.port as EurekaClient.PortWrapper).port;
    } else if (
      instance.port.hasOwnProperty('@enabled') &&
      (instance.port as EurekaClient.LegacyPortWrapper)['@enabled']
    ) {
      return (instance.port as EurekaClient.LegacyPortWrapper).$;
    }
    return 0;
  }
}
