<template>
  <div class="school-statistic-card h-100%">
    <t-card
      title="学校统计分析"
      header-bordered
      class="flex flex-col h-100%"
      :bordered="false"
    >
      <template #actions>
        <AppTreeDropdown
          :treeData="schoolTreeList"
          v-model:selectedData="card.filter.schoolIds"
          @change="handleFilterChange"
          title="学校列表"
        >
        </AppTreeDropdown>
        <AppTreeDropdown
          :treeData="assessmentTaskTreeList"
          v-model:selectedData="card.filter.assessmentTaskIds"
          @change="handleFilterChange"
          title="考核任务列表"
        >
        </AppTreeDropdown>
      </template>
      <div v-show="card.loading" class="text-center h-100% flex items-center justify-center">
        <t-loading loading />
      </div>
      <Result
        v-show="!card.loading && assessmentTaskDetails.length === 0"
        type="empty"
        tip="请先选择学校"
      />
      <div
        v-show="!card.loading && assessmentTaskDetails.length !== 0"
        ref="chartDom"
        class="h-100%"
      >
      </div>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue';
import { useDebounceFn, useResizeObserver } from '@vueuse/core'
import { getSchoolStatistic } from '@/api/statistic.api';
import { recursiveMap } from '@/utils';
import * as echarts from 'echarts';
import { handleSchoolChartData } from '@/pages/assessment/components/chart.utils';

const props = defineProps({
  schoolList: {
    type: Array,
    default: () => ([]),
  },
  assessmentTaskList: {
    type: Array,
    default: () => ([]),
  },
});

const assessmentTaskDetails = ref([]);

const schoolTreeList = computed(() => {
  return recursiveMap(props.schoolList, (item: any) => ({
    value: item.id,
    label: item.name,
  }));
});

const assessmentTaskTreeList = computed(() => {
  const result: any[] = [];
  props.assessmentTaskList.forEach((item: any) => {
    const groupItem = {
      label: item.group,
      children: [] as any[],
    };
    result.push(groupItem);
    item.children.forEach((subItem: any) => {
      groupItem.children.push({
        label: subItem.title,
        value: subItem.id,
      });
    });
  });
  return result;
})

const card = reactive({
  loading: false,
  filter: {
    schoolIds: [],
    assessmentTaskIds: [],
  },
});

const handleFilterChange = () => {
  if (card.filter.schoolIds.length > 0 && card.filter.assessmentTaskIds.length > 0) {
    handleGetSchoolListStatistic();
  } else {
    assessmentTaskDetails.value = [];
  }
}

const handleGetSchoolListStatistic = () => {
  card.loading = true;
  getSchoolStatistic({
    schoolIds: card.filter.schoolIds,
    assessmentTaskIds: card.filter.assessmentTaskIds,
  }).then((res: any) => {
    card.loading = false;
    assessmentTaskDetails.value = res.list || [];
    nextTick(() => {
      handleDrawChart();
    });
  });
};

const chartDom = ref(null);
let chart: echarts.ECharts;
const handleDrawChart = () => {
  if (!chart) {
    chart = echarts.init(chartDom.value);
    useResizeObserver(chartDom, useDebounceFn(() => {
      if (card.loading) {
        return;
      }
      chart.setOption(handleSchoolChartData(chartDom.value, assessmentTaskDetails.value), true);
      chart.resize();
    }, 50, { maxWait: 300 }));
  }
  chart.setOption(handleSchoolChartData(chartDom.value, assessmentTaskDetails.value), true);
};
</script>

<style scoped lang="less">
.school-statistic-card {
  :deep(.t-card__body) {
    flex: 1;
    overflow: hidden;
  }

  :deep(.t-card__actions) {
    position: absolute;
    right: 0;
  }
}
</style>
