import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Pagination } from "../models/pagination.model";

export const QueryPagination = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const length = request.query["length"];
    const offset = request.query["offset"] || '0';
    if (length && offset) {
      return new Pagination(Number(length), Number(offset));
    }
    return null;
  }
);
