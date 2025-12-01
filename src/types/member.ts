import { Gender } from "./auth";

export interface ProfileUpdateRequest {
  nickname: string;
  gender: Gender;
  birthdate: string;
  nationality: string;
}

export interface ProfileUpdateResponse {
  memberId: number;
  email: string;
  nickname: string;
  profileImage: string;
  gender: Gender;
  birthdate: string;
  nationality: string;
}

export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
}
