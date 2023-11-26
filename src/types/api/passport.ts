export interface LoginResult {
  accessToken: string;
  refreshToken: string;
}

export interface LoginData {
  account: string;
  password: string;
  captcha: string;
  captchaId: string;
  checked: boolean;
}

export interface CaptchaResult {
  id: string;
  imageBase64: string;
}

export interface UserInfoResult {
  id: string;
}
