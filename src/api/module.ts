import type { CommonResponse } from '@/types/api';
import { request } from '@/utils/request';

const Api = {
  TreeUrl: '/admin/module/tree',
  CreateUrl: '/admin/module/create',
  UpdateUrl: '/admin/module/',
  DeleteUrl: '/admin/module/',
};

export function getModuleTree(data: any) {
  return request.get<CommonResponse<any>>({
    url: Api.TreeUrl,
    params: data,
  });
}

export function createModule(data: any) {
  return request.post<CommonResponse<any>>({
    url: Api.CreateUrl,
    data,
  });
}

export function updateModule(id: string, data: any) {
  return request.put<CommonResponse<any>>({
    url: `${Api.UpdateUrl}${id}/`,
    data,
  });
}

export function deleteModule(id: string) {
  return request.delete<CommonResponse<any>>({
    url: `${Api.DeleteUrl}${id}/`,
  });
}
