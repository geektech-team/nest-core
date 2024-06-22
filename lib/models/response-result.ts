import { ResponsePagination } from "./pagination";

export class ResponseWithPagination {
  constructor(
    public items: unknown[],
    public pagination: ResponsePagination
  ) {}
}

export class ResponseResult {
  constructor(
    public data:
      | unknown
      | {
          items: unknown[];
          pagination: ResponsePagination;
        },
    public status = 200,
    public message = ""
  ) {}
}
