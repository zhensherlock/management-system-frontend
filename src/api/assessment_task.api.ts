import type { CommonResponse } from '@/types/api';
import { request } from '@/utils/request';

const Api = {
  ListUrl: '/user/assessment_task/list',
  CreateUrl: '/user/assessment_task/create',
  UpdateUrl: '/user/assessment_task/',
  DeleteUrl: '/user/assessment_task/',
  StatisticUrl: '/user/assessment_task/statistic/',
  DetailsUrl: '/user/assessment_task/details/',
};

export function getAssessmentTaskList(data: any) {
  return request.get<CommonResponse<any>>({
    url: Api.ListUrl,
    params: data,
  });
}

export function createAssessmentTask(data: any) {
  return request.post<CommonResponse<any>>({
    url: Api.CreateUrl,
    data,
  });
}

export function updateAssessmentTask(id: string, data: any) {
  return request.put<CommonResponse<any>>({
    url: `${Api.UpdateUrl}${id}/`,
    data,
  });
}

export function deleteAssessmentTask(id: string) {
  return request.delete<CommonResponse<any>>({
    url: `${Api.DeleteUrl}${id}/`,
  });
}

export function getAssessmentTaskStatistic(id: string) {
  return request.get<CommonResponse<any>>({
    url: `${Api.StatisticUrl}${id}/`,
  });
}

export function getAssessmentTaskDetails(id: string) {
  return request.get<CommonResponse<any>>({
    url: `${Api.DetailsUrl}${id}/`,
  });
}
