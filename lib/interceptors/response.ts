import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { ResponseResult } from "../models/response-result";

export const IgnoredResponseInterceptorSymbol = Symbol('IgnoredResponseInterceptorSymbol');

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const isIgnored = context.getHandler()[IgnoredResponseInterceptorSymbol];
    if (isIgnored) {
      return next.handle();
    }
    return next.handle().pipe(
      map((data) => {
        if (data?.pagination) {
          return data;
        }
        return new ResponseResult(data);
      })
    );
  }
}
