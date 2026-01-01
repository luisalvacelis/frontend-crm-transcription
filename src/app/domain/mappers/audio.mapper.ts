import { AudioResponseDto } from "../../api/dtos/audios.interface";
import { Audio } from "../models/audios.model";

export class AudioMapper {

  static fromDto(dto: AudioResponseDto): Audio {
    return new Audio(
      dto.id,
      dto.user_id,
      dto.campaign_id,
      dto.original_name,
      dto.original_path,
      dto.original_ext,
      dto.processed_path,
      dto.mime_type,
      dto.size_bytes,
      dto.status,
      dto.transcription,
      dto.duration_seconds,
      dto.cost,
      dto.error_message,
      dto.created_at,
      dto.updated_at
    );
  }
}
