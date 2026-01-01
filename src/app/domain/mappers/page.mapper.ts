import { PageDto } from '../../api/dtos/page.interface';
import { Page, PageMeta } from '../models/page.model';
export class PageMapper {
  static fromDto<TDto, TDomain>(
    dto: PageDto<TDto>,
    mapItem: (item: TDto) => TDomain,
  ): Page<TDomain>{
    return new Page(
      dto.items.map(mapItem),
      new PageMeta(
        dto.meta.page,
        dto.meta.page_size,
        dto.meta.total,
        dto.meta.pages
      )
    );
  }
}
