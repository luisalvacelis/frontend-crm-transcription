export interface CampaignDto{
  id:           number;
  name:         string;
  description:  string | null;
  created_at:   Date;
  updated_at:   Date;
}

export interface CampaignCreateDto{
  name:         string;
  description:  string | null;
}

export interface CampaignsStatsDto {
  id:                     number;
name:                     string;
  description:            string;
  total_audios:           number;
  total_transcribed:      number;
  status:                 string;
  uploaded:               number;
  queued:                 number;
  processing:             number;
  done:                   number;
  error:                  number;
  total_cost:             number;
  total_duration_minutes: number;
  created_at:             Date;
  updated_at:             Date;
}

export interface CampaignTranscribeAllRequestDto {
  provider: 'deepgram' | 'whisperx';
}

export interface CampaignTranscribeAllResponseDto{
  message:        string;
  campaign_id:    number;
  campaign_name:  string;
  total_audios:   number;
  provider:       string;
}

