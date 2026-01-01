export interface AudioDto {
  file:         File;
  campaign_id:  number;
}

export interface AudiosDto {
  files:         File[];
  campaign_id:  number;
}

export interface AudioCreateResponseDto {
  id:               number;
  user_id:          number;
  campaign_id:      number;
  original_name:    string;
  original_path:    string;
  original_ext:     string;
  processed_path:   string;
  mime_type:        string;
  size_bytes:       number;
  status:           string;
  transcription:    string;
  duration_seconds: number;
  cost:             number;
  error_message:    string;
  created_at:       Date;
  updated_at:       Date;
}

export interface AudiosCreateRespondeDto{
  message:  string;
  audios:   AudioCreateResponseDto[];
}
