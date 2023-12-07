import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const QueryBoolean = createParamDecorator(
  (prop: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const value = request.query[prop];
    if (value === undefined) {
      return undefined;
    }
    if (value === "true" || value === "1") {
      return true;
    }
    return false;
  }
);
