import type { CommonResponse } from '@/types/api';
import { request } from '@/utils/request';

const Api = {
  GetUrl: '/user/sys/get',
};

export function getSystemConfig(data: any) {
  return request.get<CommonResponse<any>>({
    url: Api.GetUrl,
    params: data,
  });
}
