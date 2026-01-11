import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../../core/config/api-config.service';
import { AudioResponseDto, AudioUploadDto, AudiosUploadResponseDto, AudiosUploadDto } from '../../../api/dtos/audios.interface';
import { EMPTY, expand, map, Observable, reduce } from 'rxjs';
import { Audio } from '../../../domain/models/audios.model';
import { Page } from '../../../domain/models/page.model';
import { PageDto } from '../../../api/dtos/page.interface';
import { PageMapper } from '../../../domain/mappers/page.mapper';
import { AudioMapper } from '../../../domain/mappers/audio.mapper';

@Injectable({
  providedIn: 'root'
})
export class AudiosService {

  constructor(
    private readonly _http: HttpClient,
    private readonly _api: ApiConfigService
  ) { }

  public uploadAudio(dto: AudioUploadDto): Observable<AudioResponseDto> {
    const url = this._api.main('audios/upload');
    const formData = new FormData();
    formData.append('file', dto.file);
    formData.append('campaign_id', dto.campaign_id.toString());
    return this._http.post<AudioResponseDto>(url, formData);
  }

  public uploadMultipleAudios(dto: AudiosUploadDto): Observable<AudiosUploadResponseDto> {
    const url = this._api.main('audios/upload-multiple');
    const formData = new FormData();
    dto.files.forEach(file => formData.append('files', file));
    formData.append('campaign_id', dto.campaign_id.toString());
    return this._http.post<AudiosUploadResponseDto>(url, formData);
  }

  public load(page: number = 1, pageSize: number = 10, campaignId?: number, status?: string, search?: string): Observable<Page<Audio>> {
    let url = this._api.main(`audios?page=${page}&page_size=${pageSize}`);

    if (campaignId) {
      url += `&campaign_id=${campaignId}`;
    }

    if (status) {
      url += `&status=${status}`;
    }

    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }

    return this._http.get<PageDto<AudioResponseDto>>(url).pipe(
      map(dto => PageMapper.fromDto(dto, AudioMapper.fromDto))
    );
  }

  public delete(audioId: number): Observable<void> {
    const url = this._api.main(`audios/${audioId}`);
    return this._http.delete<void>(url);
  }

  public deleteAllByCampaign(campaignId: number): Observable<any> {
    const url = this._api.main(`audios/campaign/${campaignId}/all`);
    return this._http.delete<any>(url);
  }

  public loadAllByCampaign(campaignId: number, search?: string, status?: string, pageSize: number = 500): Observable<Audio[]> {

    return this.load(1, pageSize, campaignId, status, search).pipe(
      expand((resp) => {
        const meta = resp.meta;
        if (!meta) return EMPTY;

        const nextPage = meta._page + 1;
        if (nextPage > meta._pages) return EMPTY;

        return this.load(nextPage, pageSize, campaignId, status, search);
      }),
      map(resp => resp.items ?? []),
      reduce((acc, items) => acc.concat(items), [] as Audio[])
    );
  }

}
