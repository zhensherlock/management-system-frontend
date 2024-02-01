import type { CommonResponse } from '@/types/api';
import { request } from '@/utils/request';

const Api = {
  SummaryUrl: '/user/statistic/assessment/summary',
  PublishedGroupListUrl: '/user/statistic/assessment/publishedTaskGroupList',
  AssessmentTaskStatisticUrl: '/user/statistic/assessment',
  SchoolTreeListUrl: '/user/statistic/school/list',
  SchoolStatisticUrl: '/user/statistic/schools',
};

export function getAssessmentTaskSummaryStatistic() {
  return request.get<CommonResponse<any>>({
    url: Api.SummaryUrl,
  });
}

export function getPublishedGroupList() {
  return request.get<CommonResponse<any>>({
    url: Api.PublishedGroupListUrl,
  });
}

export function getAssessmentTaskStatistic(id: string) {
  return request.get<CommonResponse<any>>({
    url: `${Api.AssessmentTaskStatisticUrl}/${id}/`,
  });
}

export function getSchoolTreeList() {
  return request.get<CommonResponse<any>>({
    url: Api.SchoolTreeListUrl,
  });
}

export function getSchoolStatistic(data: any) {
  return request.get<CommonResponse<any>>({
    url: Api.SchoolStatisticUrl,
    params: data,
  });
}
