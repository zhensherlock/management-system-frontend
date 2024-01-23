<script setup lang="ts">
import {ref, watch} from 'vue';
import {getAssessmentTaskDetails} from '@/api/assessment_task.api';
import type {PrimaryTableCol} from 'tdesign-vue-next';
import {t} from '@/locales';
import {getAssessmentTaskDetailStatus, getAssessmentTaskDetailStatusTheme} from '@/utils';

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
  { colKey: 'status', title: t('pages.assessmentTaskDetail.table.status'), minWidth: 90, align: 'center' },
  { colKey: 'score', title: t('pages.assessmentTaskDetail.table.score'), minWidth: 100, align: 'center' },
  { colKey: 'submitDate', title: t('pages.assessmentTaskDetail.table.submitDate'), minWidth: 160, align: 'center' },
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
    </t-table>
  </t-drawer>
</template>

<style scoped lang="less">
</style>
