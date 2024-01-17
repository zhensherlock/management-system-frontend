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
          <template #operation="{ row }">
            <t-space align="center" :size="0">
              <t-link hover="color" theme="primary" @click="handleRedirectUserList(row)">
                {{ $t('pages.company.userList') }}
              </t-link>
              <t-link hover="color" theme="primary" @click="handleShowUpdate(row)">
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
import { OperationTask } from '../components';
import { getAssessmentTaskList } from '@/api/assessment_task';
import type { PageInfo, PrimaryTableCol } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { t } from '@/locales';
import { useUserStore } from '@/store';

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
  { colKey: 'name', title: t('pages.company.name'), minWidth: 200, fixed: 'left' },
  { colKey: 'person', title: t('pages.company.person'), minWidth: 70 },
  { colKey: 'contact', title: t('pages.company.contact'), minWidth: 110 },
  { colKey: 'address', title: t('pages.company.address'), minWidth: 220 },
  { colKey: 'operation', title: t('pages.record.operation.label'), width: 180, fixed: 'right' },
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

const handleRedirectUserList = (row: any) => {
  router.push({
    name: 'AccountManagement',
    query: {
      organizationIds: row.id,
    },
  });
};

const handleShowUpdate = (company: any) => {
  operationTask.mdl = company;
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
</script>
<style lang="less" scoped></style>
