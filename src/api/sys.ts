import type { CommonResponse } from '@/types/api';
import { request } from '@/utils/request';

const Api = {
  GetUrl: '/admin/sys/get',
  UpdateUrl: '/admin/sys/update',
};

export function getSystemConfig() {
  return request.get<CommonResponse<any>>({
    url: Api.GetUrl,
  });
}

export function updateSystemConfig(data: any) {
  return request.post<CommonResponse<any>>({
    url: Api.UpdateUrl,
    data,
  });
}
