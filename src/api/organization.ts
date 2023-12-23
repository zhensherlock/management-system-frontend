import type { CommonResponse } from '@/types/api';
import { request } from '@/utils/request';

const Api = {
  TreeUrl: '/user/organization/tree',
};

export function getOrganizationTree(data: any) {
  return request.get<CommonResponse<any>>({
    url: Api.TreeUrl,
    params: data,
  });
}
