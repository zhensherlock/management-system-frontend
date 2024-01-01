import type { CommonResponse } from '@/types/api';
import { request } from '@/utils/request';

const Api = {
  ListUrl: '/admin/role/list',
  CreateUrl: '/admin/role/create',
  UpdateUrl: '/admin/role/',
  DeleteUrl: '/admin/role/',
};

export function getRoleList(data: any = {}) {
  return request.get<CommonResponse<any>>({
    url: Api.ListUrl,
    params: data,
  });
}

export function createRole(data: any) {
  return request.post<CommonResponse<any>>({
    url: Api.CreateUrl,
    data,
  });
}

export function updateRole(id: string, data: any) {
  return request.put<CommonResponse<any>>({
    url: `${Api.UpdateUrl}${id}/`,
    data,
  });
}

export function deleteRole(id: string) {
  return request.delete<CommonResponse<any>>({
    url: `${Api.DeleteUrl}${id}/`,
  });
}
