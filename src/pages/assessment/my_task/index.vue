<template>
  <div class="record-page">
    <FilterCard
      v-model="searchData"
      :title="pageTitle"
      :options="[
        {
          type: 'input',
          name: 'keyword',
          value: '',
          label: $t('pages.assessment_task.title'),
          placeholder: $t('pages.form.placeholder', { field: $t('pages.assessment_task.title') }),
        },
      ]"
      @submit="handleSearchSubmit"
    >
      <template #title>
        <t-tabs v-model="status" @change="handleTabChange">
          <t-tab-panel value="pending" :label="$t('pages.assessmentTaskDetail.tabs.pending')"> </t-tab-panel>
          <t-tab-panel value="submitted" :label="$t('pages.assessmentTaskDetail.tabs.submitted')"> </t-tab-panel>
          <t-tab-panel value="" :label="$t('pages.assessmentTaskDetail.tabs.all')"> </t-tab-panel>
        </t-tabs>
      </template>
    </FilterCard>
    <t-card header-bordered :bordered="false" class="data-card">
      <template #title>
        <i18n-t keypath="pages.record.table.total">
          <template #number>
            <span class="t-link--theme-danger">{{ total }}</span>
          </template>
        </i18n-t>
      </template>
      <template #actions> </template>
      <template v-if="isEmpty">
        <result type="empty" :title="$t('pages.record.empty.title')" :tip="$t('pages.record.empty.tip')"> </result>
      </template>
      <div v-else ref="tableParentElement" class="data-card-table">
        <t-table
          bordered
          hover
          row-key="id"
          ref="tableElement"
          cell-empty-content="-"
          size="small"
          :key="tableKey"
          :data="dataSource"
          :columns="columns"
          :pagination="pagination"
          :loading="loading"
          :loading-props="loadingProps"
          :max-height="tableHeight"
          @page-change="handleChangePage"
        >
          <template #title="{ row }">
            {{ row.assessmentTask.title }}
          </template>
          <template #date="{ row }">
            {{ getDateString(row.assessmentTask.startDate) }} 至 {{ getDateString(row.assessmentTask.endDate) }}
          </template>
          <template #status="{ row }">
            <t-tag :theme="getAssessmentTaskDetailStatusTheme(row.status)" variant="light-outline">
              {{ getAssessmentTaskDetailStatus(row.status) }}
            </t-tag>
          </template>
          <template #basicScore="{ row }">
            {{ row.assessmentTask.basicScore }}
          </template>
          <template #operation="{ row }">
            <t-space align="center" :size="0">
              <t-link
                hover="color"
                theme="primary"
                @click="handleShowEvaluationScore(row)"
                v-if="[AssessmentTaskDetailStatus.Pending, AssessmentTaskDetailStatus.Returned].includes(row.status)"
              >
                {{ $t('pages.assessmentTaskDetail.table.operation.evaluation') }}
              </t-link>
              <t-link
                hover="color"
                theme="primary"
                @click="handleShowEvaluationScore(row)"
                v-else-if="[AssessmentTaskDetailStatus.Submitted, AssessmentTaskDetailStatus.Done].includes(row.status)"
              >
                {{ $t('pages.record.operation.detail') }}
              </t-link>
              <template #separator>
                <t-divider layout="vertical" />
              </template>
            </t-space>
          </template>
        </t-table>
      </div>
    </t-card>
    <EvaluationScoreDrawer
      v-model="evaluationScoreDrawer.visible"
      :mdl="evaluationScoreDrawer.mdl"
      @refresh-list="handleRefreshList"
    />
  </div>
</template>
<script lang="ts">
export default {
  name: 'MyAssessmentTask',
};
</script>
<script setup lang="ts">
import type { PageInfo, PrimaryTableCol } from 'tdesign-vue-next';
import { onMounted, reactive, ref } from 'vue';
import { usePage } from '@/composeable';
import { getMyAssessmentTaskDetailList } from '@/api/assessment_task_detail.api';
import { useTable } from '@/composeable/useTable';
import { t } from '@/locales';
import { getAssessmentTaskDetailStatus, getAssessmentTaskDetailStatusTheme, getDateString } from '@/utils';
import {EvaluationScoreDrawer} from '../components';
import { AssessmentTaskDetailStatus } from '@/constants';

const { pageTitle } = usePage();
const tableParentElement = ref(null);
const tableElement = ref(null);
const dataSource = ref([]);
const status = ref('pending');
const searchData = reactive({
  date: [],
  keyword: '',
});

const fetchData = async () => {
  loading.value = true;
  try {
    // @ts-ignore
    const { list, count } = await getMyAssessmentTaskDetailList({
      status: status.value,
      currentPage: pagination.value?.current || 1,
      pageSize: pagination.value?.pageSize || 20,
      keyword: searchData.keyword,
    });
    dataSource.value = list;
    total.value = count;
  } catch {
  } finally {
    loading.value = false;
  }
};
const columns = ref<PrimaryTableCol[]>([
  { colKey: 'title', title: t('pages.assessment_task.title'), minWidth: 200 },
  { colKey: 'date', title: t('pages.assessment_task.date'), minWidth: 220, align: 'center' },
  { colKey: 'status', title: t('pages.assessment_task.status'), width: 100, align: 'center' },
  { colKey: 'basicScore', title: t('pages.assessment_task.basicScore'), width: 100, align: 'center' },
  { colKey: 'operation', title: t('pages.record.operation.label'), width: 100, align: 'center' },
]);
const total = ref(0);
const loading = ref(true);

onMounted(() => {
  fetchData();
});

const handleTabChange = (value: string) => {
  status.value = value;

  fetchData();
};

const { pagination, isEmpty, loadingProps, tableHeight, tableKey } = useTable({
  total,
  table: tableElement,
  parent: tableParentElement,
  loading,
});

const evaluationScoreDrawer = reactive({
  visible: false,
  mdl: undefined,
});

const handleShowEvaluationScore = (mdl: any) => {
  evaluationScoreDrawer.mdl = mdl;
  evaluationScoreDrawer.visible = true;
};

const handleSearchSubmit = (params: any) => {
  pagination.value && (pagination.value.current = 1);
  Object.assign(searchData, params);
  fetchData();
};

const handleChangePage = (pageInfo: PageInfo) => {
  if (!pagination) {
    return;
  }
  pagination.value.current = pageInfo.current;
  pagination.value.pageSize = pageInfo.pageSize;
  fetchData();
};

const handleRefreshList = () => {
  fetchData();
};
</script>
<style lang="less" scoped>
:deep(.filter-card) {
  .t-card__header-wrapper {
    height: 24px;
  }
}

:deep(.t-tabs) {
  .t-tabs__nav-item {
    height: calc(24px + var(--td-comp-paddingTB) * 2);
    font: var(--td-font-title-medium);
    color: var(--td-text-color-primary);
  }

  .t-tabs__nav-container.t-is-top::after {
    display: none;
  }
}
</style>
