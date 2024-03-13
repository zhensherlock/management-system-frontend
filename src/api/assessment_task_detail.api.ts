import type { CommonResponse } from '@/types/api';
import { request } from '@/utils/request';

const Api = {
  MyListUrl: '/user/assessment_task_detail/list/my',
  EvaluationScoreUrl: '/user/assessment_task_detail/evaluation/',
  FallbackEvaluationUrl: '/user/assessment_task_detail/fallback/',
};

export function getMyAssessmentTaskDetailList(data: any) {
  return request.get<CommonResponse<any>>({
    url: Api.MyListUrl,
    params: data,
  });
}

export function evaluationScore(id: string, data: any) {
  return request.post<CommonResponse<any>>({
    url: `${Api.EvaluationScoreUrl}${id}/`,
    data,
  });
}

export function fallbackEvaluation(id: string) {
  return request.post<CommonResponse<any>>({
    url: `${Api.FallbackEvaluationUrl}${id}/`,
  });
}
