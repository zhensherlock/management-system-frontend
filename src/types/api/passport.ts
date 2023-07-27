export interface LoginResult {
  accessToken: string;
  refreshToken: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface CaptchaResult {
  id: string;
  imageBase64: string;
}

export interface UserInfoResult {
  id: string;
}
