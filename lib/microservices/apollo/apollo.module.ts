import { HttpModule } from "@nestjs/axios";
import { DynamicModule, ForwardReference, Type } from "@nestjs/common";
import * as Apollo from "ctrip-apollo";
import { ApolloService } from "./apollo.service";

interface ApolloModuleOptions {
  url: string;
  appId: string;
  cluster: string;
  namespace: string;
  global?: boolean;
}

interface ApolloModuleAsyncOptions {
  imports?: (
    | DynamicModule
    | Type<any>
    | Promise<DynamicModule>
    | ForwardReference<any>
  )[];
  inject?: any[];
  useFactory?: (
    ...args: any[]
  ) => Promise<ApolloModuleOptions> | ApolloModuleOptions;
  global?: boolean;
}

export const APOLLO_MODULE_OPTIONS = "APOLLO_MODULE_OPTIONS";

export class ApolloModule {
  static async forRoot(options: ApolloModuleOptions): Promise<DynamicModule> {
    const apollo = await apolloWithOption(options);
    return {
      global: options.global,
      module: ApolloModule,
      imports: [HttpModule],
      exports: [ApolloService],
      providers: [ApolloService, apollo],
    };
  }

  static async forRootAsync(
    asyncOptions: ApolloModuleAsyncOptions
  ): Promise<DynamicModule> {
    const importModules = asyncOptions.imports || [];
    return {
      global: asyncOptions.global,
      module: ApolloModule,
      imports: [HttpModule, ...importModules],
      exports: [ApolloService],
      providers: [
        {
          provide: APOLLO_MODULE_OPTIONS,
          useFactory: asyncOptions.useFactory,
          inject: asyncOptions.inject,
        },
        {
          provide: "APOLLO_PROVIDER",
          useFactory: async (options) => await apolloWithOption(options),
          inject: [APOLLO_MODULE_OPTIONS],
        },
        ApolloService,
      ],
    };
  }
}

async function getApolloConfig(options: ApolloModuleOptions) {
  const apollo = await Apollo({
    host: options.url,
    appId: options.appId,
  })
    .cluster(options.cluster)
    .namespace(options.namespace)
    .ready();
  return apollo;
}

async function apolloWithOption(options: ApolloModuleOptions) {
  const urlList = options.url?.split(",");
  let apollo;
  if (urlList.length) {
    try {
      apollo = await getApolloConfig({ ...options, url: urlList[0] });
    } catch (error) {
      options.url = urlList.splice(1).join(",");
      return await apolloWithOption(options);
    }
  }
  return apollo;
}
