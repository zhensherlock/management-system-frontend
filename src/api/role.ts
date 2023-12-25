import type { CommonResponse } from '@/types/api';
import { request } from '@/utils/request';

const Api = {
  ListUrl: '/user/role/list',
};

export function getRoleList(data: any = {}) {
  return request.get<CommonResponse<any>>({
    url: Api.ListUrl,
    params: data,
  });
}
