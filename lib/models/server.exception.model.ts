import { HttpException } from '@nestjs/common';

export class ServerException extends HttpException {
  code: number;
  constructor(code: number, message: string) {
    super(message, 200);
    this.code = code;
  }
}
