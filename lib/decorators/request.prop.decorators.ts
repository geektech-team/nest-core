import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestProp = (prop: string) => createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request[prop] || '';
  },
);
