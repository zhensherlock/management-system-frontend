import type { CommonResponse } from '@/types/api';
import { request } from '@/utils/request';

const Api = {
  GetProfileUrl: '/profile/basic',
  UpdateProfileUrl: '/profile/basic',
  UpdatePasswordUrl: '/profile/password',
};

export function getProfile() {
  return request.get<CommonResponse<any>>({
    url: Api.GetProfileUrl,
  });
}

export function updateProfile(data: any) {
  return request.put<CommonResponse<any>>({
    url: Api.UpdateProfileUrl,
    params: data,
  });
}

export function updatePassword(data: any) {
  return request.put<CommonResponse<any>>({
    url: Api.UpdatePasswordUrl,
    params: data,
  });
}
