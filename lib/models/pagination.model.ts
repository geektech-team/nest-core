export class Pagination {
  constructor(public length: number, public offset: number) {}
}

export class ResponsePagination extends Pagination {
  constructor(
    public length: number,
    public offset: number,
    public total: number
  ) {
    super(length, offset);
  }
}
