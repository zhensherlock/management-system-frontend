import type { CommonResponse } from '@/types/api';
import { request } from '@/utils/request';

const Api = {
  ListUrl: '/user/school/list',
  TreeUrl: '/user/school/tree',
  CreateUrl: '/user/school/create',
  UpdateUrl: '/user/school/',
  DeleteUrl: '/user/school/',
  ImportUrl: '/user/school/import',
};

export function getSchoolList(data: any) {
  return request.get<CommonResponse<any>>({
    url: Api.ListUrl,
    params: data,
  });
}

export function getSchoolTree(data: any) {
  return request.get<CommonResponse<any>>({
    url: Api.TreeUrl,
    params: data,
  });
}

export function importSchools(file: File) {
  return request.upload('file', file, {
    url: Api.ImportUrl
  })
}

export function createSchool(data: any) {
  return request.post<CommonResponse<any>>({
    url: Api.CreateUrl,
    data,
  });
}

export function updateSchool(id: string, data: any) {
  return request.put<CommonResponse<any>>({
    url: `${Api.UpdateUrl}${id}/`,
    data,
  });
}

export function deleteSchool(id: string) {
  return request.delete<CommonResponse<any>>({
    url: `${Api.DeleteUrl}${id}/`,
  });
}
