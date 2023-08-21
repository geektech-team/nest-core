import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Pagination } from '../models/pagination.model';

export const QueryPagination = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const length = Number.parseInt(request.query['length'] as string);
    const offset = Number.parseInt(request.query['offset'] as string);
    return new Pagination(length, offset);
  },
);
