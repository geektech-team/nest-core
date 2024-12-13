import { ServerExceptionCode } from "../enums/server-exception";
import {
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
  SetMetadata,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { logger } from "../logger";
import { ServerException } from "../models/server-exception";

const REFLECTOR = "Reflector";
const TOKEN = "TOKEN";

export const Token = (key: string) => SetMetadata(TOKEN, key);

export class AuthInterceptor implements NestInterceptor {
  constructor(@Inject(REFLECTOR) protected readonly reflector: any) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const tokenKey = this.reflector.get(TOKEN, context.getHandler());
    const token = request.headers[tokenKey] as string;
    if (!token) {
      throw new ServerException(ServerExceptionCode.TokenExpired, "请先登录");
    }
    try {
      await this.exchangeToken(token, request);
    } catch (error) {
      logger.error(`登录认证失败：${error}`);
      throw new ServerException(
        ServerExceptionCode.RpcNotFoundService,
        "登录认证失败"
      );
    }
    return next.handle();
  }

  private async exchangeToken(token: string, request) {
    return null;
  }
}
