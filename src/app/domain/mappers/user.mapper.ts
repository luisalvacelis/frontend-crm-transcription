import { MeDto } from "../../api/dtos/auh.interface";
import { User } from "../models/user.model";

export class UserMapper{
  static fromDto(dto: MeDto): User{
    return new User(
      dto.id,
      dto.fullname,
      dto.email,
      dto.is_active,
      dto.created_at,
      dto.updated_at
    )
  }
}
