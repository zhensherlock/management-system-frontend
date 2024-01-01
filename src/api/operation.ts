import type { CommonResponse } from '@/types/api';
import { request } from '@/utils/request';

const Api = {
  ListUrl: '/admin/operation/list',
  CreateUrl: '/admin/operation/create',
  UpdateUrl: '/admin/operation/',
  DeleteUrl: '/admin/operation/',
};

export function getOperationList(data: any) {
  return request.get<CommonResponse<any>>({
    url: Api.ListUrl,
    params: data,
  });
}

export function createOperation(data: any) {
  return request.post<CommonResponse<any>>({
    url: Api.CreateUrl,
    data,
  });
}

export function updateOperation(id: string, data: any) {
  return request.put<CommonResponse<any>>({
    url: `${Api.UpdateUrl}${id}/`,
    data,
  });
}

export function deleteOperation(id: string) {
  return request.delete<CommonResponse<any>>({
    url: `${Api.DeleteUrl}${id}/`,
  });
}
