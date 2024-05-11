import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import logger from '../logger';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    logger.log(`${request.method} ${request.url}`);
    const startTime = new Date().getTime();
    return next.handle().pipe(
      tap(() => {
        const endTime = new Date().getTime();
        const time = endTime - startTime;
        if (time > 1000) {
          logger.warn(
            `请求耗时太大，耗时：${time}ms，${request.method} ${request.url}`,
          );
        }
      }),
    );
  }
}
