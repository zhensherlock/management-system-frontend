import type { CommonResponse } from '@/types/api';
import { request } from '@/utils/request';

const Api = {
  MyListUrl: '/user/assessment_task_detail/list/my',
};

export function getMyAssessmentTaskDetailList(data: any) {
  return request.get<CommonResponse<any>>({
    url: Api.MyListUrl,
    params: data,
  });
}
