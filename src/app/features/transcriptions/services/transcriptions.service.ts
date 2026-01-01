import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../../core/config/api-config.service';
import { AudioResponseDto, AudioUploadDto, AudiosUploadResponseDto, AudiosUploadDto } from '../../../api/dtos/audios.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranscriptionsService {

  constructor(
    private readonly _http: HttpClient,
    private readonly _api: ApiConfigService
  ) { }

}
