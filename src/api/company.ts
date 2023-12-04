import type { CommonResponse } from '@/types/api';
import { request } from '@/utils/request';

const Api = {
  ListUrl: '/user/company/list',
  CreateUrl: '/user/company/create',
  UpdateUrl: '/user/company/',
  DeleteUrl: '/user/company/',
  ImportUrl: '/user/company/import',
};

export function getList(data: any) {
  return request.get<CommonResponse<any>>({
    url: Api.ListUrl,
    params: data,
  });
}

export function importCompanies(file: File) {
  return request.upload('file', file, {
    url: Api.ImportUrl
  })
}

export function createCompany(data: any) {
  return request.post<CommonResponse<any>>({
    url: Api.CreateUrl,
    data,
  });
}

export function updateCompany(id: string, data: any) {
  return request.put<CommonResponse<any>>({
    url: `${Api.UpdateUrl}${id}/`,
    data,
  });
}

export function deleteCompany(id: string) {
  return request.delete<CommonResponse<any>>({
    url: `${Api.DeleteUrl}${id}/`,
  });
}
