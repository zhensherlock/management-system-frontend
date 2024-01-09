import type { CommonResponse } from '@/types/api';
import { request } from '@/utils/request';

const Api = {
  ListUrl: '/user/work_order/list',
  CreateUrl: '/user/work_order/create',
  AuditUrl: '/user/work_order/audit',
  CancelUrl: '/user/work_order/cancel',
};

export function getWorkOrderList(data: any) {
  return request.get<CommonResponse<any>>({
    url: Api.ListUrl,
    params: data,
  });
}

export function createWorkOrder(data: any) {
  return request.post<CommonResponse<any>>({
    url: Api.CreateUrl,
    data,
  });
}

export function auditWorkOrder(id: string, data: any) {
  return request.put<CommonResponse<any>>({
    url: `${Api.AuditUrl}${id}/`,
    data,
  });
}

export function cancelWorkOrder(id: string) {
  return request.delete<CommonResponse<any>>({
    url: `${Api.CancelUrl}${id}/`,
  });
}
