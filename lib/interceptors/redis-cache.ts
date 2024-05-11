import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/common/cache";
import { Cache } from "cache-manager";
import logger from "../logger";
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
      logger.log(`使用缓存: ${key}`);
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

  // 如果有其他因素影响缓存，如用户id则应在应用层重写这个方法
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
