<template>
  <div class="school-statistic-card h-100% min-h-400px">
    <t-card
      header-bordered
      class="flex flex-col h-100%"
      :bordered="false"
      :loading="card.loading"
    >
      <template #title>
        <t-popup placement="right-top" :visible="card.schoolPopupVisible">
          <div class="flex items-center">
            <span class="inline-block mr-5px">学校统计分析</span>
            <MapSettingIcon ref="triggerIcon" class="cursor-pointer" @click="card.schoolPopupVisible = !card.schoolPopupVisible" />
          </div>
          <template #content>
            <div ref="triggerPopup">
              <t-tree
                :label="true"
                :checkable="true"
                :expandAll="true"
                :icon="true"
                :line="true"
                :transition="true"
                :hover="true"
                :activable="false"
                :active-multiple="false"
                :expand-on-click-node="true"
                :data="schoolTreeList"
                @change="handleChangeSelectedSchoolList"
              />
            </div>
          </template>
        </t-popup>
      </template>
      <template #actions>
        <t-button theme="default" variant="outline" size="small">
          <template #suffix>
            <ChevronDownIcon />
          </template>
          学校列表
        </t-button>
      </template>
      <Result
        v-if="assessmentTaskDetails.length === 0" type="empty"
        tip="请先选择学校"
      />
      <div v-else ref="chartDom" class="h-100%"></div>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { MapSettingIcon, ChevronDownIcon } from 'tdesign-icons-vue-next';
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { onClickOutside } from '@vueuse/core'
import { getSchoolStatistic } from '@/api/statistic.api';
import { recursiveMap } from '@/utils';
import * as echarts from 'echarts';
import { Chart } from '@antv/g2';

const props = defineProps({
  selectedSchoolIds: {
    type: Array,
    default: () => ([]),
  },
  schoolList: {
    type: Array,
    default: () => ([]),
  },
});

const emits = defineEmits(['update:selectedSchoolIds']);

const assessmentTaskDetails = ref([]);

const schoolTreeList = computed(() => {
  return recursiveMap(props.schoolList, (item: any) => ({
    value: item.id,
    label: item.name,
  }));
});

watch(() => props.selectedSchoolIds, () => {
  if (props.selectedSchoolIds.length) {
    handleGetSchoolListStatistic();
  }
});

const triggerIcon = ref(null);
const triggerPopup = ref(null);
onClickOutside(triggerPopup, () => {
  card.schoolPopupVisible = false;
}, {
  ignore: [triggerIcon],
});

const card = reactive({
  schoolPopupVisible: false,
  loading: false,
});

const handleChangeSelectedSchoolList = (value: any[]) => {
  emits('update:selectedSchoolIds', value);
  card.schoolPopupVisible = false;
};

const handleGetSchoolListStatistic = () => {
  card.loading = true;
  getSchoolStatistic({
    schoolIds: props.selectedSchoolIds
  }).then((res: any) => {
    assessmentTaskDetails.value = res || [];
    nextTick(() => {
      handleDrawChart();
    });
    card.loading = false;
  });
};

const chartDom = ref(null);
let chart: echarts.ECharts;
const handleDrawChart = () => {
  if (!chart) {
    chart = echarts.init(chartDom.value);
  }
  chart.setOption({
    tooltip: {
      trigger: 'axis',
    },
    legend: {},
    grid: {
      left: '0%',
      right: '0%',
      bottom: '0%',
      containLabel: true,
    },
    toolbox: {},
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [
        '2023年2月校园保安服务质量考核',
        '2023年3月校园保安服务质量考核',
        '2023年4月校园保安服务质量考核',
        '2023年5月校园保安服务质量考核',
        '2023年6月校园保安服务质量考核',
        '2023年7月校园保安服务质量考核',
        '2023年8月校园保安服务质量考核',
      ],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '白鹿小学',
        type: 'line',
        smooth: true,
        data: [120, 132, 101, 134, 90, 130, 110],
      },
      {
        name: '万里小学',
        type: 'line',
        smooth: true,
        data: [99, 82, 91, 134, 90, 130, 110],
      },
      {
        name: '平江小学',
        type: 'line',
        smooth: true,
        data: [100, 132, 101, 104, 100, 130, 110],
      },
      {
        name: '金阊小学',
        type: 'line',
        smooth: true,
        data: [120, 132, 101, 134, 100, 130, 120],
      },
      {
        name: '沧浪小学',
        type: 'line',
        smooth: true,
        data: [120, 132, 101, 134, 120, 130, 120],
      },
    ],
  });
};

const handleDrawChart1 = () => {
  if (!chart) {
    chart = new Chart({
      container: chartDom.value,
      autoFit: true,
    });
  }
}
</script>

<style scoped lang="less">
.school-statistic-card {
  :deep(.t-card__body) {
    flex: 1;
  }
}
</style>
