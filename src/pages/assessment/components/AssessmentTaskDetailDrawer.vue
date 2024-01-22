<script setup lang="ts">
import {ref, watch} from 'vue';
import {getAssessmentTaskDetails} from '@/api/assessment_task.api';
import type {PrimaryTableCol} from 'tdesign-vue-next';
import {t} from '@/locales';

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
  { colKey: 'school', title: t('pages.assessment_task_detail.table.school'), minWidth: 200 },
  { colKey: 'status', title: t('pages.assessment_task_detail.table.status'), width: 100 },
  { colKey: 'score', title: t('pages.assessment_task_detail.table.score'), width: 100 },
  { colKey: 'submitDate', title: t('pages.assessment_task_detail.table.submitDate'), width: 160 },
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
    />
  </t-drawer>
</template>

<style scoped lang="less">
</style>
