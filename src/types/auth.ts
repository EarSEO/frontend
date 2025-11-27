export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum Provider {
  GOOGLE = "GOOGLE",
  APPLE = "APPLE",
}

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  nickname: string;
  gender?: Gender;
  birthdate?: string;
  nationality?: string;
}

export interface SocialSignUpRequest {
  email: string;
  provider: Provider;
  nickname: string;
  gender?: Gender;
  birthdate?: string;
  nationality?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  memberId: number;
  email: string;
  nickname: string;
  role: Role;
}

export interface SignUpResponse {
  memberId: number;
  email: string;
  nickname: string;
  role: Role;
}

export interface SocialLoginResponse {
  isNewMember: boolean;
  email: string;

  accessToken?: string;
  refreshToken?: string;
  memberId?: number;
  nickname?: string;
  role?: Role;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  memberId: number;
  email: string;
  nickname: string;
  role: Role;
}
