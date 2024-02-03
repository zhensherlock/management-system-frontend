<template>
  <div class="record-page">
    <FilterCard
      :title="pageTitle"
      v-model="searchData"
      :options="[
        {
          type: 'input',
          name: 'keyword',
          value: '',
          label: $t('pages.assessment.title'),
          placeholder: $t('pages.form.placeholder', { field: $t('pages.assessment.title') }),
        },
      ]"
      @submit="handleSearchSubmit"
    >
      <template #actions>
        <t-button size="small" variant="text" theme="primary" class="icon-operation" @click="handleShowCreateDialog">
          <template #icon><span class="t-icon i-material-symbols-add-circle"></span></template>
          {{ $t('pages.assessment.create') }}
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
        <t-enhanced-table
          bordered
          hover
          ref="tableElement"
          row-key="id"
          cell-empty-content="-"
          size="small"
          :data="dataSource"
          :columns="columns"
          :pagination="pagination"
          :loading="loading"
          :loadingProps="loadingProps"
          :max-height="tableHeight"
          :key="tableKey"
          :tree="treeConfig"
          @page-change="handleChangePage"
        >
          <template #operation="{ row }">
            <t-space align="center" :size="0">
              <t-link hover="color" theme="primary" @click="handleShowCreateChildrenDialog(row)">
                {{ $t('pages.assessment.addAssessment') }}
              </t-link>
              <t-link hover="color" theme="primary" @click="handleShowUpdateDialog(row)">
                {{ $t('pages.record.operation.update') }}
              </t-link>
              <t-popconfirm
                theme="danger"
                :content="$t('pages.record.operation.deleteConfirm')"
                @confirm="handleDeleteConfirm(row)"
              >
                <t-link hover="color" theme="danger">{{ $t('pages.record.operation.delete') }}</t-link>
              </t-popconfirm>
              <template #separator>
                <t-divider layout="vertical" />
              </template>
            </t-space>
          </template>
          <template #score="{ row }">
            <span
              :class="{
                't-link--theme-danger': row.scoreType === AssessmentScoreType.Add,
                't-link--theme-success': row.scoreType === AssessmentScoreType.Subtract,
              }"
            >
              {{ row.scoreType === AssessmentScoreType.Add ? '加分' : '扣分' }}
            </span>
            <span>上限</span>
            <span>{{ row.maximumScore }}</span>
          </template>
        </t-enhanced-table>
      </div>
    </t-card>
    <OperationAssessment
      v-model="operationModel.visible"
      v-model:mdl="operationModel.mdl"
      :is-edit="operationModel.isEdit"
      :list="dataSource"
      @refresh-list="handleRefreshList"
    >
    </OperationAssessment>
  </div>
</template>
<script lang="ts">
export default {
  name: 'AssessmentList',
};
</script>
<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
import { useTable } from '@/composeable/useTable';
import { OperationAssessment } from './components';
import { deleteAssessment, getAssessmentTree } from '@/api/assessment';
import type { PageInfo, PrimaryTableCol } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { t } from '@/locales';
import { AssessmentScoreType } from '@/constants';
import { usePage } from '@/composeable';

const { pageTitle } = usePage();
const tableParentElement = ref(null);
const tableElement = ref(null);
const dataSource = ref([]);

const searchData = reactive({
  keyword: '',
});

const fetchData = async () => {
  loading.value = true;
  try {
    // @ts-ignore
    const { list, count } = await getAssessmentTree({
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
  { colKey: 'title', title: t('pages.assessment.title'), minWidth: 300, fixed: 'left' },
  { colKey: 'sequence', title: t('pages.assessment.sequence'), width: 80 },
  { colKey: 'score', title: t('pages.assessment.score'), width: 100 },
  { colKey: 'createdDate', title: t('pages.employee.createdDate'), width: 160 },
  { colKey: 'updatedDate', title: t('pages.employee.updatedDate'), width: 160 },
  { colKey: 'operation', title: t('pages.record.operation.label'), width: 210, fixed: 'right' },
]);
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
  hiddenPage: true,
});

const operationModel = reactive({
  visible: false,
  isEdit: false,
  mdl: undefined,
});

const handleShowCreateDialog = () => {
  operationModel.mdl = undefined;
  operationModel.isEdit = false;
  operationModel.visible = true;
};

const handleShowCreateChildrenDialog = (row: any) => {
  operationModel.mdl = {
    parentId: row.id,
    scoreType: row.scoreType,
    maximumScore: row.maximumScore,
    sequence: (row?.children?.length || 0) + 1,
  };
  operationModel.isEdit = false;
  operationModel.visible = true;
};

const handleShowUpdateDialog = (company: any) => {
  operationModel.mdl = company;
  operationModel.isEdit = true;
  operationModel.visible = true;
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
};

const handleDeleteConfirm = (row: any) => {
  deleteAssessment(row.id).then(() => {
    fetchData();
    MessagePlugin.success(t('pages.message.delete'));
  });
};

const handleRefreshList = async () => {
  await fetchData();
  await nextTick(() => {
    tableElement.value.expandAll();
  });
};

const treeConfig = reactive({
  treeNodeColumnIndex: 0,
  indent: 25,
  defaultExpandAll: true,
});
</script>
<style lang="less" scoped></style>
