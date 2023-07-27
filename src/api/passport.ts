import type { CommonResponse } from '@/types/api';
import type { CaptchaResult, LoginData, LoginResult, UserInfoResult } from '@/types/api/passport';
import { request } from '@/utils/request';

const Api = {
  LoginUrl: '/user/passport/login',
  CaptchaUrl: '/user/passport/captcha',
  UserInfoUrl: '/user/info/',
};

export function login(data: LoginData) {
  return request.post<LoginResult>({
    url: Api.LoginUrl,
    data,
  });
}

export function captcha() {
  return request.get<CommonResponse<CaptchaResult>>({
    url: Api.CaptchaUrl,
  });
}

export function getUserInfo() {
  return request.get<UserInfoResult>({
    url: Api.UserInfoUrl,
  });
}
