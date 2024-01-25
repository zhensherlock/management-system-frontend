<script setup lang="ts">
import {reactive, ref, watch} from 'vue';
import { getAssessmentTaskDetails } from '@/api/assessment_task.api';
import type { PrimaryTableCol } from 'tdesign-vue-next';
import { t } from '@/locales';
import { getAssessmentTaskDetailStatus, getAssessmentTaskDetailStatusTheme } from '@/utils';
import { EvaluationScoreDrawer } from './index';

const props = defineProps({
  modelValue: Boolean,
  mdl: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(['update:modelValue']);

watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue) {
      return;
    }
    fetchData();
  },
);

const columns = ref<PrimaryTableCol[]>([
  { colKey: 'school', title: t('pages.assessmentTaskDetail.table.school'), minWidth: 200 },
  { colKey: 'score', title: t('pages.assessmentTaskDetail.table.score'), width: 320, align: 'center' },
  { colKey: 'status', title: t('pages.assessmentTaskDetail.table.status'), width: 100, align: 'center' },
  { colKey: 'submitDate', title: t('pages.assessmentTaskDetail.table.submitDate'), width: 170, align: 'center' },
  { colKey: 'operation', title: t('pages.record.operation.label'), width: 100, align: 'center' },
]);
const dataSource = ref([]);
const total = ref(0);
const loading = ref(true);

const fetchData = async () => {
  loading.value = true;
  try {
    // @ts-ignore
    const { list, count } = await getAssessmentTaskDetails(props.mdl.id);
    dataSource.value = list;
    total.value = count;
  } catch {
  } finally {
    loading.value = false;
  }
}

const evaluationScoreDrawer = reactive({
  visible: false,
  mdl: undefined,
});

const handleShowInfo = (mdl: any) => {
  evaluationScoreDrawer.visible = true;
  evaluationScoreDrawer.mdl = mdl;
}

const handleClose = () => {
  emits('update:modelValue', false);
};
</script>
<template>
  <t-drawer
    v-bind="$attrs"
    :visible="props.modelValue"
    :closeBtn="true"
    :closeOnOverlayClick="false"
    :preventScrollThrough="true"
    :size-draggable="true"
    :destroyOnClose="true"
    :footer="false"
    size="1000px"
    @close="handleClose"
    class="task-detail-drawer"
  >
    <template #header>
      {{ props.mdl.title }} - {{ $t('pages.assessment_task.statistic.header.detailButton') }}
    </template>
    <t-table
      bordered
      size="small"
      row-key="id"
      cell-empty-content="-"
      :columns="columns"
      :data="dataSource"
      :loading="loading"
      :filter-value="filterValue"
      @filter-change="onFilterChange"
    >
      <template #school="{ row }">
        {{ row.receiveSchoolOrganization.name }}
      </template>
      <template #status="{ row }">
        <t-tag :theme="getAssessmentTaskDetailStatusTheme(row.status)" variant="light-outline">
          {{ getAssessmentTaskDetailStatus(row.status) }}
        </t-tag>
      </template>
      <template #score="{ row }">
        <i18n-t keypath="pages.assessmentTaskContentTable.summary" v-if="row.totalScore">
          <template #totalScore>
            <span class="t-link--theme-primary">{{ row.totalScore }}</span>
          </template>
          <template #totalSubtractScore>
            <span class="t-link--theme-success">{{ row.totalSubtractScore }}</span>
          </template>
          <template #totalAddScore>
            <span class="t-link--theme-danger">{{ row.totalAddScore }}</span>
          </template>
          <template #grade>
            <span class="t-link--theme-warning">{{ row.grade }}</span>
          </template>
        </i18n-t>
        <template v-else>-</template>
      </template>
      <template #operation="{ row }">
        <t-space align="center" :size="0">
          <t-link hover="color" theme="primary" @click="handleShowInfo(row)">
            {{ $t('pages.record.operation.detail') }}
          </t-link>
          <template #separator>
            <t-divider layout="vertical" />
          </template>
        </t-space>
      </template>
    </t-table>
    <EvaluationScoreDrawer
      v-model="evaluationScoreDrawer.visible"
      :mdl="evaluationScoreDrawer.mdl"
    />
  </t-drawer>
</template>

<style scoped lang="less">
</style>
