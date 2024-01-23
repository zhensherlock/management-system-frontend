import {
  AssessmentTaskDetailStatus,
  AssessmentTaskStatus,
  EmployeeSex,
  EmployeeStatus,
  WorkOrderStatus
} from '@/constants';
import { t } from '@/locales';
import _ from 'lodash';

export const getSex = (sex: string) => {
  if (sex === EmployeeSex.Male) {
    return '男';
  } else if (sex === EmployeeSex.Female) {
    return '女';
  } else {
    return '未知';
  }
};

export const getWorkOrderStatusLabel = (status: string) => {
  switch (status) {
    case WorkOrderStatus.Pending:
      return '待审批';
    case WorkOrderStatus.Completed:
      return '已通过';
    case WorkOrderStatus.Rejected:
      return '已拒绝';
    case WorkOrderStatus.Cancellation:
      return '已作废';
    default:
      return '-';
  }
}

export const getWorkOrderStatusTheme = (status: string) => {
  switch (status) {
    case WorkOrderStatus.Pending:
      return 'primary';
    case WorkOrderStatus.Completed:
      return 'success';
    case WorkOrderStatus.Rejected:
      return 'danger';
    case WorkOrderStatus.Cancellation:
      return 'warning';
    default:
      return 'default';
  }
}

export const getWorkOrderOperationContent = (content: any) => {
  let operation = '';
  switch (content.type) {
    case 1:
      operation = '修改员工';
      break;
    case 2:
      operation = '新增员工';
      break;
  }
  return `${operation} - ${content.employee.name}`
}

export const getEmployeeStatus = (status: string) => {
  switch (status) {
    case EmployeeStatus.Normal:
      return t('pages.employee.statusMap.normal');
    case EmployeeStatus.Leave:
      return t('pages.employee.statusMap.leave');
    case EmployeeStatus.Other:
      return t('pages.employee.statusMap.other');
  }
}

export const getSchoolById = (id: string, schoolList: any[]) => {
  return _.find(schoolList, { 'value': id });
}

export const getAssessmentTaskStatus = (status: string) => {
  switch (status) {
    case AssessmentTaskStatus.Draft:
      return t('pages.assessment_task.statusMap.draft');
    case AssessmentTaskStatus.Official:
      return t('pages.assessment_task.statusMap.official');
    case AssessmentTaskStatus.Done:
      return t('pages.assessment_task.statusMap.done');
    case AssessmentTaskStatus.Cancellation:
      return t('pages.assessment_task.statusMap.cancellation');
  }
}

export const getAssessmentTaskStatusTheme = (status: string) => {
  switch (status) {
    case AssessmentTaskStatus.Draft:
      return 'warning';
    case AssessmentTaskStatus.Official:
      return 'primary';
    case AssessmentTaskStatus.Done:
      return 'success';
    // case AssessmentTaskStatus.Cancellation:
    //   return 'warning';
    default:
      return 'default';
  }
}

export const getAssessmentTaskDetailStatus = (status: string) => {
  switch (status) {
    case AssessmentTaskDetailStatus.Pending:
      return t('pages.assessmentTaskDetail.statusMap.pending');
    case AssessmentTaskDetailStatus.Submitted:
      return t('pages.assessmentTaskDetail.statusMap.submitted');
    case AssessmentTaskDetailStatus.Returned:
      return t('pages.assessmentTaskDetail.statusMap.returned');
    case AssessmentTaskDetailStatus.Done:
      return t('pages.assessmentTaskDetail.statusMap.done');
  }
}

export const getAssessmentTaskDetailStatusTheme = (status: string) => {
  switch (status) {
    case AssessmentTaskDetailStatus.Pending:
      return 'warning';
    case AssessmentTaskDetailStatus.Submitted:
      return 'primary';
    case AssessmentTaskDetailStatus.Returned:
      return 'danger';
    case AssessmentTaskDetailStatus.Done:
      return 'success';
    default:
      return 'default';
  }
}
