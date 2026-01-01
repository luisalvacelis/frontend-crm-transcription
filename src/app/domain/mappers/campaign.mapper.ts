import { CampaignDto, CampaignsStatsDto } from "../../api/dtos/campaigns.interface";
import { Campaign, CampaignStats } from "../models/campaign.model";

export class CampaignMapper{

  static fromDto(dto: CampaignDto): Campaign{
    return new Campaign(
      dto.id,
      dto.name,
      dto.description,
      dto.created_at,
      dto.updated_at
    );
  }

  static fromStatsDto(dto: CampaignsStatsDto): CampaignStats{
    return new CampaignStats(
      dto.id,
      dto.name,
      dto.description,
      dto.total_audios,
      dto.total_transcribed,
      dto.status,
      dto.uploaded,
      dto.queued,
      dto.processing,
      dto.done,
      dto.error,
      dto.total_cost,
      dto.total_duration_minutes,
      dto.created_at,
      dto.updated_at
    );
  }
}
