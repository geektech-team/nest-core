import { HttpModule } from '@nestjs/axios';
import {
  DynamicModule,
  ForwardReference,
  Provider,
  Type,
} from '@nestjs/common';
import Eureka from 'eureka-js-client';
import * as os from 'os';
import { EurekaClient } from './eureka.client';
import { EurekaDiscovery } from './eureka.discovery';
import { EurekaRegister } from './eureka.register';

export interface EurekaServiceOptions {
  name: string;
  port: number;
}

export interface EurekaModuleOptions {
  eureka: Eureka.EurekaClient.EurekaClientConfig;
  service: EurekaServiceOptions;
  metadata: Record<string, string>;
  disableDiscovery?: boolean;
  disable?: boolean;
  global?: boolean;
}

export interface EurekaModuleAsyncOptions {
  imports?: (
    | DynamicModule
    | Type<any>
    | Promise<DynamicModule>
    | ForwardReference<any>
  )[];
  inject?: any[];
  useFactory?: (
    ...args: any[]
  ) => Promise<EurekaModuleOptions> | EurekaModuleOptions;
  global?: boolean;
}

export const EUREKA_MODULE_OPTIONS = 'EUREKA_MODULE_OPTIONS';

export class EurekaModule {
  static forRoot(options: EurekaModuleOptions): DynamicModule {
    return {
      global: options.global,
      module: EurekaModule,
      imports: [HttpModule],
      exports: [EurekaClient],
      providers: [
        {
          provide: Eureka,
          useValue: eurekaOf(options),
        },
        EurekaDiscovery,
        EurekaClient,
        EurekaRegister,
      ],
    };
  }

  static forRootAsync(asyncOptions: EurekaModuleAsyncOptions): DynamicModule {
    const importModules = asyncOptions.imports || [];
    return {
      global: asyncOptions.global,
      module: EurekaModule,
      imports: [HttpModule, ...importModules],
      exports: [EurekaClient],
      providers: [
        {
          provide: Eureka,
          useFactory: (options) => eurekaOf(options),
          inject: [EUREKA_MODULE_OPTIONS],
        },
        {
          provide: EUREKA_MODULE_OPTIONS,
          useFactory: asyncOptions.useFactory,
          inject: asyncOptions.inject,
        },
        EurekaDiscovery,
        EurekaClient,
        EurekaRegister,
      ],
    };
  }
}

function eurekaOf(options: EurekaModuleOptions): Provider {
  const host = getIPAddress();
  const name = options.service.name;
  const port = options.service.port;
  const eureka = new Eureka({
    instance: {
      instanceId: `${host}:${port}:${name}`,
      app: name,
      hostName: host,
      ipAddr: host,
      port: {
        // prettier-ignore
        '$': port,
        '@enabled': true,
      },
      vipAddress: name.toLowerCase(),
      healthCheckUrl: `http://${host}:${port}/health`,
      homePageUrl: `http://${host}:${port}/`,
      statusPageUrl: `http://${host}:${port}/info`,
      dataCenterInfo: {
        // prettier-ignore
        'name': 'MyOwn',
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      },
      metadata: options.metadata,
    },
    eureka: options.eureka,
  });
  return eureka;
}

function getIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
}
