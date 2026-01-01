import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../../core/config/api-config.service';
import { map, Observable } from 'rxjs';
import { Page } from '../../../domain/models/page.model';
import { Campaign } from '../../../domain/models/campaign.model';
import { PageDto } from '../../../api/dtos/page.interface';
import { CampaignCreateDto, CampaignDto, CampaignsStatsDto } from '../../../api/dtos/campaigns.interface';
import { CampaignMapper } from '../../../domain/mappers/campaign.mapper';
import { PageMapper } from '../../../domain/mappers/page.mapper';

@Injectable({
  providedIn: 'root'
})
export class CampaignsService {

  constructor(
    private readonly _http: HttpClient,
    private readonly _api: ApiConfigService
  ) { }

  public load(page: number, pageSize: number, search?: string): Observable<Page<Campaign>>{
    let url = this._api.main(`campaigns?page=${page}&page_size=${pageSize}`);
    if(search && search.trim()){
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    return this._http.get<PageDto<CampaignDto>>(url).pipe(
      map(dto => PageMapper.fromDto(dto, CampaignMapper.fromDto))
    );
  }

  public loadStatsAll(page: number, pageSize: number, search?: string){
    let url = this._api.main(`campaigns/with-stats?page=${page}&page_size=${pageSize}`);
    if(search && search.trim()){
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    return this._http.get<PageDto<CampaignsStatsDto>>(url).pipe(
      map(dto => PageMapper.fromDto(dto, CampaignMapper.fromStatsDto))
    );
  }

  public create(dto: CampaignCreateDto): Observable<CampaignDto>{
    const url = this._api.main('campaigns');
    return this._http.post<CampaignDto>(url, dto);
  }

  public update(id: number, dto: CampaignCreateDto): Observable<void> {
    const url = this._api.main(`campaigns/${id}`);
    return this._http.put<void>(url, dto);
  }

  public delete(id: number){
    const url = this._api.main(`campaigns/${id}`);
    return this._http.delete<void>(url);
  }
}
