import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestProp = createParamDecorator(
  (prop: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request[prop];
  },
);
