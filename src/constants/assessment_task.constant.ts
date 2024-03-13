import { t } from '@/locales';

export const AssessmentTaskStatus = {
  Draft: 'draft',
  Official: 'official',
  Done: 'done',
  Cancellation: 'cancellation',
}

export const AssessmentTaskDetailStatus = {
  Pending: 'pending',
  Submitted: 'submitted',
  Returned: 'pending-returned',
  Done: 'done',
}

export const AssessmentTaskDetailStatusList = [
  {
    label: t('pages.assessmentTaskDetail.statusMap.pending'),
    value: AssessmentTaskDetailStatus.Pending,
  },
  {
    label: t('pages.assessmentTaskDetail.statusMap.submitted'),
    value: AssessmentTaskDetailStatus.Submitted,
  },
  {
    label: t('pages.assessmentTaskDetail.statusMap.returned'),
    value: AssessmentTaskDetailStatus.Returned,
  },
  {
    label: t('pages.assessmentTaskDetail.statusMap.done'),
    value: AssessmentTaskDetailStatus.Done,
  }
];
