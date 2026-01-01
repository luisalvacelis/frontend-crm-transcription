import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../../core/config/api-config.service';
import { AudioCreateResponseDto, AudioDto, AudiosCreateRespondeDto, AudiosDto } from '../../../api/dtos/audios.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranscriptionsService {

  constructor(
    private readonly _http: HttpClient,
    private readonly _api: ApiConfigService
  ) { }

  public uploadAudio(dto: AudioDto): Observable<AudioCreateResponseDto>{
    const url = this._api.main('audios/upload');
    return this._http.post<AudioCreateResponseDto>(url, dto);
  }

  public uploadMultipleAudios(dto: AudiosDto): Observable<AudiosCreateRespondeDto>{
    const url = this._api.main('audios/upload-multiple');
    return this._http.post<AudiosCreateRespondeDto>(url, dto);
  }
}
