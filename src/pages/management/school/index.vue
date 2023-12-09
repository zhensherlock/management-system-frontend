<template>
  <div class="record-page">
    <FilterCard
      title="学校列表"
      v-model="searchData"
      @submit="handleSearchSubmit"
    >
      <template #actions>
        <t-button size="small" variant="text" theme="primary" class="icon-operation" @click="handleShowImport">
          <template #icon><span class="t-icon i-ic-sharp-cloud-upload"></span></template>
          {{ $t('pages.school.import') }}
        </t-button>
        <t-button size="small" variant="text" theme="primary" class="icon-operation" @click="handleShowCreate">
          <template #icon><span class="t-icon i-material-symbols-add-circle"></span></template>
          {{ $t('pages.school.create') }}
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
    <OperationCompany
      v-model="operationCompany.visible"
      :is-edit="operationCompany.isEdit"
      v-model:mdl="operationCompany.mdl"
      @refresh-list="handleRefreshList"
    >
    </OperationCompany>
    <ImportCompany v-model="importVisible" @refresh-list="handleRefreshList"></ImportCompany>
  </div>
</template>
<script lang="ts">
export default {
  name: 'CompanyList',
};
</script>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useTable } from '@/composeable /useTable';
import { OperationCompany, ImportCompany } from './components';
import { getSchoolList, deleteSchool } from '@/api/school';
import type { PageInfo, PrimaryTableCol } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { t } from '@/locales';

const tableParentElement = ref(null);
const tableElement = ref(null);
const dataSource = ref([]);

const searchData = ref({
  keyword: '',
});

const fetchData = async () => {
  loading.value = true;
  try {
    const { list, count } = await getSchoolList({ keyword: searchData.keyword });
    dataSource.value = list;
    total.value = count;
  } catch {
  } finally {
    loading.value = false;
  }
};
const columns = ref<PrimaryTableCol[]>([
  { colKey: 'name', title: t('pages.school.name') },
  { colKey: 'person', title: t('pages.school.person') },
  { colKey: 'contact', title: t('pages.school.contact') },
  { colKey: 'createdDate', title: t('pages.employee.createdDate'), width: 160 },
  { colKey: 'updatedDate', title: t('pages.employee.updatedDate'), width: 160 },
  { colKey: 'operation', title: t('pages.record.operation.label'), width: 100 },
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

const operationCompany = reactive({
  visible: false,
  isEdit: false,
  mdl: undefined,
});

const handleShowCreate = () => {
  operationCompany.mdl = undefined;
  operationCompany.isEdit = false;
  operationCompany.visible = true;
};

const handleShowUpdate = (company: any) => {
  operationCompany.mdl = company;
  operationCompany.isEdit = true;
  operationCompany.visible = true;
};

const importVisible = ref(false);
const handleShowImport = () => {
  importVisible.value = true;
};

const handleSearchSubmit = () => {
  pagination.value && (pagination.value.current = 1);
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
  deleteSchool(row.id).then(() => {
    fetchData();
    MessagePlugin.success(t('pages.message.delete'));
  });
};

const handleRefreshList = () => {
  fetchData();
};
</script>
<style lang="less" scoped></style>
