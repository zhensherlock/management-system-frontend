<script lang="ts">
export default {
  name: 'StatisticAssessment',
};
</script>
<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { usePage } from '@/composeable';
// import { getAssessmentTaskStatistic } from '@/api/assessment_task.api';

const { pageTitle } = usePage();

onMounted(() => {
  getAssessmentTaskStatisticData();
})

const statistic = reactive({
  total: 0,
  submitted: 0,
  pending: 0,
  returned: 0,
  done: 0,
  donePercentage: 0,
  animation: {
    start: true,
    params: {
      valueFrom: 0,
      duration: 200,
    },
  },
});

const getAssessmentTaskStatisticData = () => {
  statistic.total = 0;
  statistic.submitted = 0;
  statistic.pending = 0;
  statistic.returned = 0;
  statistic.done = 0;
  statistic.donePercentage = 0;
  // getAssessmentTaskStatistic('').then((res: any) => {
  //   statistic.total = res.total;
  //   statistic.submitted = res.submitted;
  //   statistic.pending = res.pending;
  //   statistic.returned = res.returned;
  //   statistic.done = res.done;
  //   statistic.donePercentage = res.donePercentage;
  // });
}
</script>

<template>
  <div class="record-page">
    <t-card header-bordered :bordered="false" :title="pageTitle">
      <t-space class="w-100% text-center" align="center">
        <t-statistic
          :title="$t('pages.statistic.assessment.summary.total')"
          :value="statistic.total"
          color="black"
          :animation="statistic.animation.params"
          :animation-start="statistic.animation.start"
        />
        <t-statistic
          :title="$t('pages.statistic.assessment.summary.unpublished')"
          :value="statistic.submitted"
          color="blue"
          :animation="statistic.animation.params"
          :animation-start="statistic.animation.start"
        />
        <t-statistic
          :title="$t('pages.statistic.assessment.summary.inProgress')"
          :value="statistic.pending"
          color="orange"
          :animation="statistic.animation.params"
          :animation-start="statistic.animation.start"
        />
        <t-statistic
          :title="$t('pages.statistic.assessment.summary.done')"
          :value="statistic.returned"
          color="red"
          :animation="statistic.animation.params"
          :animation-start="statistic.animation.start"
        />
        <t-statistic
          :title="$t('pages.statistic.assessment.summary.donePercentage')"
          :decimal-places="2"
          :value="statistic.donePercentage"
          unit="%"
          color="green"
          :animation="statistic.animation.params"
          :animation-start="statistic.animation.start"
        />
        <template #separator>
          <t-divider class="h-66px" layout="vertical" />
        </template>
      </t-space>
    </t-card>
  </div>
</template>

<style scoped lang="less">
</style>
