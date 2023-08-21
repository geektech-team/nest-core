import {
  CACHE_MANAGER,
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { logger } from "../logger";
import { of, tap } from "rxjs";

@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
  @Inject(CACHE_MANAGER)
  private readonly cacheManager: Cache;
  private allowedMethods = ["GET"];
  public ttl = 60 * 1000;
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    if (!this.isRequestCacheable(context)) {
      return next.handle();
    }
    const key = this.trackBy(context);
    if (!key) {
      return next.handle();
    }
    const value = await this.cacheManager.get(key);
    if (value) {
      logger.info(`使用缓存: ${key}`);
      return of(value);
    }
    return next.handle().pipe(
      tap({
        next: async (value) => {
          this.cacheManager.set(key, value, this.ttl);
        },
      })
    );
  }

  trackBy(context: ExecutionContext): string | undefined {
    if (!this.isRequestCacheable(context)) {
      return undefined;
    }
    const req = context.switchToHttp().getRequest();
    let key = req.path + "?";
    const query = req.query;
    const queryKeys = Object.keys(query).sort();
    for (const queryKey of queryKeys) {
      key += `&${queryKey}=${query[queryKey]}`;
    }
    return key;
  }

  isRequestCacheable(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    return this.allowedMethods.includes(req.method);
  }
}
