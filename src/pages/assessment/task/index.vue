<template>
  <div class="record-page">
    <FilterCard
      :title="$t('pages.assessment_task.page.title')"
      v-model="searchData"
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
      <template #actions>
        <t-button size="small" variant="text" theme="primary" class="icon-operation" @click="handleShowCreate">
          <template #icon><span class="t-icon i-material-symbols-add-circle"></span></template>
          {{ $t('pages.assessment_task.create') }}
        </t-button>
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
      <div v-else class="data-card-table" ref="tableParentElement">
        <t-table
          ref="tableElement"
          bordered
          hover
          cell-empty-content="-"
          size="small"
          :data="dataSource"
          :columns="columns"
          :row-key="rowKey"
          :vertical-align="verticalAlign"
          :pagination="pagination"
          :loading="loading"
          :loadingProps="loadingProps"
          :max-height="tableHeight"
          :key="tableKey"
          @page-change="handleChangePage"
        >
          <template #date="{ row }">
            {{ getDateString(row.startDate) }} 至 {{ getDateString(row.endDate) }}
          </template>
          <template #status="{ row }">
            <t-tag :theme="getAssessmentTaskStatusTheme(row.status)" variant="light-outline">
              {{ getAssessmentTaskStatus(row.status) }}
            </t-tag>
          </template>
          <template #operation="{ row }">
            <t-space align="center" :size="0">
              <template v-if="row.status === AssessmentTaskStatus.Draft">
                <t-link
                  hover="color"
                  theme="primary"
                  @click="handleShowUpdate(row)"
                >
                  {{ $t('pages.record.operation.update') }}
                </t-link>
                <t-popconfirm
                  theme="danger"
                  :content="$t('pages.record.operation.deleteConfirm')"
                  @confirm="handleDeleteConfirm(row)"
                >
                  <t-link hover="color" theme="danger">{{ $t('pages.record.operation.delete') }}</t-link>
                </t-popconfirm>
              </template>
              <template v-else-if="row.status === AssessmentTaskStatus.Official">
                <t-link hover="color" theme="primary" @click="handleShowAssessmentTaskDrawer(row)">
                  {{ $t('pages.record.operation.detail') }}
                </t-link>
              </template>
              <template #separator>
                <t-divider layout="vertical" />
              </template>
            </t-space>
          </template>
        </t-table>
      </div>
    </t-card>
    <OperationTask
      v-model="operationTask.visible"
      :is-edit="operationTask.isEdit"
      v-model:mdl="operationTask.mdl"
      @refresh-list="handleRefreshList"
    >
    </OperationTask>
    <AssessmentTaskDrawer
      v-model="assessmentTaskDrawer.visible"
      :mdl="assessmentTaskDrawer.mdl"
    />
  </div>
</template>
<script lang="ts">
export default {
  name: 'AssessmentTaskList',
};
</script>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTable } from '@/composeable/useTable';
import { OperationTask, AssessmentTaskDrawer } from '../components';
import { getAssessmentTaskList, deleteAssessmentTask } from '@/api/assessment_task.api';
import type { PageInfo, PrimaryTableCol } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { t } from '@/locales';
import { getAssessmentTaskStatus, getAssessmentTaskStatusTheme, getDateString } from '@/utils';
import { AssessmentTaskStatus } from '@/constants';

const tableParentElement = ref(null);
const tableElement = ref(null);
const dataSource = ref([]);
const router = useRouter();

const searchData = reactive({
  keyword: '',
});

const fetchData = async () => {
  loading.value = true;
  try {
    // @ts-ignore
    const { list, count } = await getAssessmentTaskList({
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
  { colKey: 'title', title: t('pages.assessment_task.title'), minWidth: 200, fixed: 'left' },
  { colKey: 'date', title: t('pages.assessment_task.date'), minWidth: 220, align: 'center' },
  { colKey: 'status', title: t('pages.assessment_task.status'), minWidth: 90, align: 'center' },
  { colKey: 'basicScore', title: t('pages.assessment_task.basicScore'), minWidth: 100, align: 'center' },
  { colKey: 'operation', title: t('pages.record.operation.label'), width: 100, align: 'center', fixed: 'right' },
]);
const rowKey = 'index';
const verticalAlign = 'top' as const;
const total = ref(0);
const loading = ref(true);

onMounted(() => {
  fetchData();
});

const { pagination, isEmpty, loadingProps, tableHeight, tableKey } = useTable({
  total,
  table: tableElement,
  parent: tableParentElement,
  loading,
});

const operationTask = reactive({
  visible: false,
  isEdit: false,
  mdl: undefined,
});

const handleShowCreate = () => {
  operationTask.mdl = undefined;
  operationTask.isEdit = false;
  operationTask.visible = true;
};

const handleShowUpdate = (mdl: any) => {
  operationTask.mdl = mdl;
  operationTask.isEdit = true;
  operationTask.visible = true;
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

const handleDeleteConfirm = (row: any) => {
  deleteAssessmentTask(row.id).then(() => {
    fetchData();
    MessagePlugin.success(t('pages.message.delete'));
  });
}

const assessmentTaskDrawer = reactive({
  visible: false,
  mdl: undefined,
});

const handleShowAssessmentTaskDrawer = (row: any) => {
  assessmentTaskDrawer.mdl = row;
  assessmentTaskDrawer.visible = true;
};
</script>
<style lang="less" scoped></style>
