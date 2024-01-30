<script lang="ts">
export default {
  name: 'StatisticAssessment',
};
</script>
<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { SwapIcon } from 'tdesign-icons-vue-next';
import { usePage } from '@/composeable';
import { t } from '@/locales';
import { getAssessmentTaskSummaryStatistic, getPublishedGroupList } from '@/api/statistic.api';


const { pageTitle } = usePage();

onMounted(() => {
  handleGetSummaryStatistic();
  handleGetPublishedGroupList();
})

const statistic = reactive({
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
});

const handleGetSummaryStatistic = () => {
  statistic.published = 0;
  statistic.draft = 0;
  statistic.official = 0;
  statistic.done = 0;
  statistic.donePercentage = 0;
  getAssessmentTaskSummaryStatistic().then((res: any) => {
    statistic.published = res.published;
    statistic.draft = res.draft;
    statistic.official = res.official;
    statistic.done = res.done;
    statistic.donePercentage = res.donePercentage;
  });
}

const publishedAssessments = reactive({
  list: [],
  currentAssessment: null,
});

const handleGetPublishedGroupList = () => {
  getPublishedGroupList().then((data: any) => {
    if (data.official.length > 0) {
      publishedAssessments.list.push({
        group: t('pages.assessment_task.statusMap.official'),
        children: data.official,
      })
    }
    if (data.done.length > 0) {
      publishedAssessments.list.push({
        group: t('pages.assessment_task.statusMap.done'),
        children: data.done,
      })
    }
    if (publishedAssessments.list.length > 0) {
      publishedAssessments.currentAssessment = publishedAssessments.list[0].children[0]
    }
  });
}
</script>

<template>
  <div class="record-page">
    <t-card header-bordered :bordered="false" :title="pageTitle">
      <t-space class="w-100% text-center" align="center">
        <t-statistic
          :title="$t('pages.statistic.assessment.summary.total')"
          :value="statistic.published"
          color="black"
          :animation="statistic.animation.params"
          :animation-start="statistic.animation.start"
        />
        <t-statistic
          :title="$t('pages.statistic.assessment.summary.unpublished')"
          :value="statistic.draft"
          color="blue"
          :animation="statistic.animation.params"
          :animation-start="statistic.animation.start"
        />
        <t-statistic
          :title="$t('pages.statistic.assessment.summary.inProgress')"
          :value="statistic.official"
          color="orange"
          :animation="statistic.animation.params"
          :animation-start="statistic.animation.start"
        />
        <t-statistic
          :title="$t('pages.statistic.assessment.summary.done')"
          :value="statistic.done"
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
    <t-card header-bordered :bordered="false" v-if="publishedAssessments.currentAssessment">
      <template #title>
        <t-popup placement="right-top" trigger="click">
          <div class="flex items-center">
            <span class="inline-block mr-5px">{{ publishedAssessments.currentAssessment.title }} - 统计分析</span>
            <SwapIcon class="cursor-pointer" />
          </div>
          <template #content>
            <div class="t-select__dropdown-inner t-select__dropdown-inner--size-m max-w-300px">
              <ul>
                <li
                  v-for="item in publishedAssessments.list"
                  :key="item.group"
                  class="t-select-option-group t-size-m t-select-option-group__divider"
                >
                  <div class="t-select-option-group__header">{{ item.group }}</div>
                  <ul>
                    <li
                      v-for="subItem in item.children"
                      :key="subItem.id"
                      :title="subItem.title"
                      class="t-select-option t-size-m"
                    >
                      <span>{{ subItem.title }}</span>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </template>
        </t-popup>
      </template>

    </t-card>
  </div>
</template>

<style scoped lang="less">
</style>
