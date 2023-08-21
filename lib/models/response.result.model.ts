import { ResponsePagination } from "./pagination.model";

export class ResponseResult {
  constructor(
    public data: any,
    public statusCode = 200,
    public comments = "",
    public pagination?: ResponsePagination
  ) {}
}
