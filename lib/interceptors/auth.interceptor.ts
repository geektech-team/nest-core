import { TOKEN_KEY } from './../constants';
import { ServerExceptionCode } from './../enums/server.exception.enum';
import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { logger } from '../logger';
import {
  ServerException,
} from '../models/server.exception.model';
import config from '../nest.config';

const TokenKey = config[TOKEN_KEY];

export class AuthInterceptor implements NestInterceptor {

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers[TokenKey] as string;
    if (!token) {
      throw new ServerException(ServerExceptionCode.TokenExpired, '请先登录');
    }
    try {
      await this.exchangeToken(token, request);
    } catch (error) {
      logger.error(`登录认证失败：${error}`);
      throw new ServerException(
        ServerExceptionCode.RpcNotFoundService,
        '登录认证失败',
      );
    }
    return next.handle();
  }

  private async exchangeToken(token: string, request) {
    return null;
  }
}
