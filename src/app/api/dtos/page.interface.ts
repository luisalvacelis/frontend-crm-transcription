export type PageMetaDto = {
  page: number;
  page_size: number;
  total: number;
  pages: number;
}

export type PageDto<TItem> = {
  items: TItem[];
  meta: PageMetaDto;
}
