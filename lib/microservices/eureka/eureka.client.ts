import { HttpService } from '@nestjs/axios';
import {} from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import logger from '../../logger';
import { EurekaDiscovery } from './eureka.discovery';

export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK';

export interface RpcOptions {
  service: string;
  path: string;
  method?: Method;
  headers?: any;
  params?: any;
  data?: any;
  timeout?: number;
}

@Injectable()
export class EurekaClient {
  @Inject()
  private readonly httpService: HttpService;

  @Inject()
  private readonly discovery: EurekaDiscovery;

  rpc(options: RpcOptions) {
    const ipAddress = this.discovery.getServiceAddress(options.service);
    let path = options.path;
    if (path.startsWith('/')) {
      path = path.substring(1);
    }
    const url = `http://${ipAddress}/${path}`;
    return new Promise((resolve: (data: any) => any, reject) => {
      this.httpService
        .request({
          url: url,
          method: options.method,
          headers: options.headers,
          data: options.data,
          params: options.params,
          timeout: options.timeout,
        })
        .subscribe({
          next: (value) => {
            const data = value.data || {};
            resolve(data);
          },
          error: (error) => {
            logger.error(`rpc调用失败， ${error}`);
            reject(error);
          },
        });
    });
  }
}
