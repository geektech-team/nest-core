import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const QueryDate = createParamDecorator(
  (prop: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const value = request.query[prop];
    if (value === undefined) {
      return undefined;
    }
    return new Date(value);
  }
);
