export interface SignUpDto {
  fullname: string;
  email:    string;
  password: string;
}

export interface SignUpResponseDto {
  id:         number;
  fullname:   string;
  email:      string;
  is_active:  boolean;
  created_at: Date;
  updated_at: Date;
}

export interface LoginDto {
  email:    string;
  password: string;
}

export interface LoginResponseDto {
  access_token: string;
  token_type:   string;
}

export interface MeDto {
  id:         number;
  fullname:   string;
  email:      string;
  is_active:  boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ErrorDetailDto {
  detail: Detail[];
}

export interface Detail {
  loc:  Array<number | string>;
  msg:  string;
  type: string;
}
