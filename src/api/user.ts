import type { CommonResponse } from '@/types/api';
import { request } from '@/utils/request';

const Api = {
  ListUrl: '/user/user/list',
  CreateUrl: '/user/user/create',
  UpdateUrl: '/user/user/',
  DeleteUrl: '/user/user/',
  ImportUrl: '/user/user/import',
};

export function getUserList(data: any) {
  return request.get<CommonResponse<any>>({
    url: Api.ListUrl,
    params: data,
  });
}

export function importUsers(file: File) {
  return request.upload('file', file, {
    url: Api.ImportUrl
  })
}

export function createUser(data: any) {
  return request.post<CommonResponse<any>>({
    url: Api.CreateUrl,
    data,
  });
}

export function updateUser(id: string, data: any) {
  return request.put<CommonResponse<any>>({
    url: `${Api.UpdateUrl}${id}/`,
    data,
  });
}

export function deleteUser(id: string) {
  return request.delete<CommonResponse<any>>({
    url: `${Api.DeleteUrl}${id}/`,
  });
}
