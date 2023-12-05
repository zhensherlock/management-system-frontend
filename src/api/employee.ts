import type { CommonResponse } from '@/types/api';
import { request } from '@/utils/request';

const Api = {
  ListUrl: '/user/employee/list',
  CreateUrl: '/user/employee/create',
  UpdateUrl: '/user/employee/',
  DeleteUrl: '/user/employee/',
  ImportUrl: '/user/employee/import',
};

export function getList(data: any) {
  return request.get<CommonResponse<any>>({
    url: Api.ListUrl,
    params: data,
  });
}

export function importEmployees(file: File) {
  return request.upload('file', file, {
    url: Api.ImportUrl
  })
}

export function createEmployee(data: any) {
  return request.post<CommonResponse<any>>({
    url: Api.CreateUrl,
    data,
  });
}

export function updateEmployee(id: string, data: any) {
  return request.put<CommonResponse<any>>({
    url: `${Api.UpdateUrl}${id}/`,
    data,
  });
}

export function deleteEmployee(id: string) {
  return request.delete<CommonResponse<any>>({
    url: `${Api.DeleteUrl}${id}/`,
  });
}
