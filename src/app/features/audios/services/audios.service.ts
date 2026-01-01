import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../../core/config/api-config.service';
import { AudioResponseDto, AudioUploadDto, AudiosUploadResponseDto, AudiosUploadDto } from '../../../api/dtos/audios.interface';
import { Observable } from 'rxjs';

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
}
