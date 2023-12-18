import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const QueryArray = createParamDecorator(
  (prop: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const value = request.query[prop];
    if (!value) {
      return null;
    }
    const substrings = value.split(",");
    return substrings;
  }
);
