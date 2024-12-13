import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ServerException } from '../models/server-exception';
import { logger } from '../logger';
import { ResponseResult } from '../models/response-result';

@Catch(ServerException)
export class ServerExceptionFilter implements ExceptionFilter {
  catch(exception: ServerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.getResponse() as string;
    logger.error(`${exception.code}: ${message} \n ${exception.stack}`);
    response.status(200).json(new ResponseResult({}, exception.code, message));
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: ServerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let message = exception.message as string;
    const status = exception.code || exception.getStatus();
    logger.error(`${status}: ${message} \n ${exception.stack}`);
    if (status >= 500 && status < 600) {
      message = '服务器错误，请稍后再试';
    }
    response.status(200).json(new ResponseResult({}, status, message));
  }
}
