export class PageMeta {
  constructor(
    public readonly _page: number,
    public readonly _pageSize: number,
    public readonly _total: number,
    public readonly _pages: number,
  ) {}
}

export class Page<T> {
  constructor(
    public readonly items: T[],
    public readonly meta: PageMeta,
  ) {}
}
