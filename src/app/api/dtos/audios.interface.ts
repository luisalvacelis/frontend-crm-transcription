export interface AudioUploadDto {
  file:         File;
  campaign_id:  number;
}

export interface AudiosUploadDto {
  files:         File[];
  campaign_id:  number;
}

export interface AudioResponseDto {
  id:                 number;
  user_id:            number;
  campaign_id:        number;
  original_name:      string;
  original_path:      string;
  original_ext:       string;
  processed_path:     string | null;
  mime_type:          string | null;
  size_bytes:         number | null;
  status:             string;
  transcription:      string | null;
  duration_seconds:   number | null;
  cost:               number | null;
  error_message:      string | null;
  created_at:         Date;
  updated_at:         Date;
}

export interface AudiosUploadResponseDto {
  message:  string;
  audios:   AudioResponseDto[];
}
