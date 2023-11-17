import { ForwardReference } from "@nestjs/common";
import { Type } from "@nestjs/common";
import { DynamicModule } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/common/cache";
import { redisStore } from "cache-manager-redis-yet";
import { RedisService } from "./redis.service";

interface RedisModuleOptions {
  global?: boolean;
  socket: {
    host: string;
    port: number;
  };
  password: string;
  ttl: number;
}

interface RedisModuleAsyncOptions {
  imports?: (
    | DynamicModule
    | Type<any>
    | Promise<DynamicModule>
    | ForwardReference<any>
  )[];
  inject?: any[];
  useFactory?: (
    ...args: any[]
  ) => Promise<RedisModuleOptions> | RedisModuleOptions;
  global?: boolean;
}

export const REDIS_MODULE_OPTIONS = "REDIS_MODULE_OPTIONS";

export class RedisModule {
  static async forRoot(options: RedisModuleOptions): Promise<DynamicModule> {
    return {
      global: options.global,
      module: RedisModule,
      exports: [CACHE_MANAGER, RedisService],
      providers: [
        {
          provide: CACHE_MANAGER,
          useFactory: (options) => redisStore(options),
        },
        RedisService
      ],
    };
  }
  static async forRootAsync(
    asyncOptions: RedisModuleAsyncOptions
  ): Promise<DynamicModule> {
    const importModules = asyncOptions.imports || [];
    return {
      global: asyncOptions.global,
      module: RedisModule,
      imports: [...importModules],
      exports: [CACHE_MANAGER, RedisService],
      providers: [
        {
          provide: CACHE_MANAGER,
          useFactory: (options) => redisStore(options),
          inject: [REDIS_MODULE_OPTIONS],
        },
        {
          provide: REDIS_MODULE_OPTIONS,
          useFactory: asyncOptions.useFactory,
          inject: asyncOptions.inject,
        },
        RedisService
      ],
    };
  }
}
