<template>
  <div class="record-page">
    <div class="card">
      <t-card header-bordered :bordered="false" :title="pageTitle">
        <t-space class="w-100% text-center" align="center">
          <t-statistic
            :title="$t('pages.statistic.assessment.summary.total')"
            :value="summaryCard.statistics.published"
            color="black"
            :animation="summaryCard.statistics.animation.params"
            :animation-start="summaryCard.statistics.animation.start"
          />
          <t-statistic
            :title="$t('pages.statistic.assessment.summary.unpublished')"
            :value="summaryCard.statistics.draft"
            color="blue"
            :animation="summaryCard.statistics.animation.params"
            :animation-start="summaryCard.statistics.animation.start"
          />
          <t-statistic
            :title="$t('pages.statistic.assessment.summary.inProgress')"
            :value="summaryCard.statistics.official"
            color="orange"
            :animation="summaryCard.statistics.animation.params"
            :animation-start="summaryCard.statistics.animation.start"
          />
          <t-statistic
            :title="$t('pages.statistic.assessment.summary.done')"
            :value="summaryCard.statistics.done"
            color="red"
            :animation="summaryCard.statistics.animation.params"
            :animation-start="summaryCard.statistics.animation.start"
          />
          <t-statistic
            :title="$t('pages.statistic.assessment.summary.donePercentage')"
            :decimal-places="2"
            :value="summaryCard.statistics.donePercentage"
            unit="%"
            color="green"
            :animation="summaryCard.statistics.animation.params"
            :animation-start="summaryCard.statistics.animation.start"
          />
          <template #separator>
            <t-divider class="h-66px" layout="vertical" />
          </template>
        </t-space>
      </t-card>
    </div>
    <div class="card">
      <OneAssessmentTaskStatisticCard
        v-model:currentAssessmentTask="oneAssessmentTaskStatisticCard.currentAssessmentTask"
        :assessment-task-list="oneAssessmentTaskStatisticCard.assessmentTaskList"
      />
    </div>
<!--    <div class="card flex-1">-->
<!--      <SchoolStatisticCard-->
<!--        v-model:selectedSchoolIds="schoolStatisticCard.selectedSchoolIds"-->
<!--        :school-list="schoolStatisticCard.schoolList"-->
<!--      />-->
<!--    </div>-->
  </div>
</template>

<script lang="ts">
export default {
  name: 'StatisticAssessment',
};
</script>
<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { usePage } from '@/composeable';
import { t } from '@/locales';
import {
  getAssessmentTaskSummaryStatistic,
  getPublishedGroupList,
  getSchoolTreeList,
} from '@/api/statistic.api';
import {
  OneAssessmentTaskStatisticCard,
  SchoolStatisticCard
} from '@/pages/assessment/components';

const { pageTitle } = usePage();

onMounted(() => {
  handleGetSummaryStatistic();
  handleGetPublishedGroupList();
  handleGetSchoolTreeList();
});

const summaryCard = reactive({
  statistics: {
    published: 0,
    draft: 0,
    official: 0,
    done: 0,
    donePercentage: 0,
    animation: {
      start: true,
      params: {
        valueFrom: 0,
        duration: 200,
      },
    },
  },
});

const handleGetSummaryStatistic = () => {
  summaryCard.statistics.published = 0;
  summaryCard.statistics.draft = 0;
  summaryCard.statistics.official = 0;
  summaryCard.statistics.done = 0;
  summaryCard.statistics.donePercentage = 0;
  getAssessmentTaskSummaryStatistic().then((res: any) => {
    summaryCard.statistics.published = res.published;
    summaryCard.statistics.draft = res.draft;
    summaryCard.statistics.official = res.official;
    summaryCard.statistics.done = res.done;
    summaryCard.statistics.donePercentage = res.donePercentage;
  });
}

const oneAssessmentTaskStatisticCard = reactive({
  assessmentTaskList: [],
  currentAssessmentTask: null,
});

const handleGetPublishedGroupList = () => {
  getPublishedGroupList().then((data: any) => {
    if (data.official.length > 0) {
      oneAssessmentTaskStatisticCard.assessmentTaskList.push({
        group: t('pages.assessment_task.statusMap.official'),
        children: data.official,
      });
    }
    if (data.done.length > 0) {
      oneAssessmentTaskStatisticCard.assessmentTaskList.push({
        group: t('pages.assessment_task.statusMap.done'),
        children: data.done,
      });
    }
    if (oneAssessmentTaskStatisticCard.assessmentTaskList.length > 0) {
      oneAssessmentTaskStatisticCard.currentAssessmentTask = oneAssessmentTaskStatisticCard.assessmentTaskList[0].children[0];
    }
  });
};

const schoolStatisticCard = reactive({
  schoolList: [],
  selectedSchoolIds: [],
});

const handleGetSchoolTreeList = () => {
  getSchoolTreeList().then((data: any) => {
    schoolStatisticCard.schoolList = data.list;
  });
};
</script>

<style scoped lang="less">
.card {
  & + .card {
    margin-top: var(--td-comp-margin);
  }
}
</style>
