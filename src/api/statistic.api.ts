import type { CommonResponse } from '@/types/api';
import { request } from '@/utils/request';

const Api = {
  SummaryUrl: '/user/statistic/assessment/summary',
  PublishedGroupListUrl: '/user/statistic/assessment/publishedTaskGroupList',
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
