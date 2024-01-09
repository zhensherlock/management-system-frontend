<template>
  <div class="record-page">
    <FilterCard
      v-model="searchData"
      title="保安人员"
      :options="[
        {
          type: 'cascader',
          name: 'organizationIds',
          value: [],
          label: $t('pages.employee.organization'),
          placeholder: $t('pages.form.selectPlaceholder', { field: $t('pages.employee.organization') }),
          children: organizationList,
          props: {
            multiple: true,
            valueMode: 'parentFirst',
            'min-collapsed-num': 1,
          },
        },
        {
          type: 'input',
          name: 'keyword',
          value: '',
          label: $t('pages.employee.name'),
          placeholder: $t('pages.form.placeholder', { field: $t('pages.employee.name') }),
        },
      ]"
      @submit="handleSearchSubmit"
    >
      <template #actions>
        <t-button size="small" variant="text" theme="primary" class="icon-operation" @click="handleShowImport">
          <template #icon><span class="t-icon i-ic-sharp-cloud-upload"></span></template>
          {{ $t('pages.employee.import') }}
        </t-button>
        <t-button size="small" variant="text" theme="primary" class="icon-operation" @click="handleShowCreate">
          <template #icon><span class="t-icon i-material-symbols-add-circle"></span></template>
          {{ $t('pages.employee.create') }}
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
      <div v-else ref="tableParentElement" class="data-card-table">
        <t-table
          ref="tableElement"
          bordered
          hover
          :key="tableKey"
          cell-empty-content="-"
          size="small"
          :data="dataSource"
          :columns="columns"
          :row-key="rowKey"
          :vertical-align="verticalAlign"
          :pagination="pagination"
          :loading="loading"
          :loading-props="loadingProps"
          :max-height="tableHeight"
          @page-change="handleChangePage"
        >
          <template #sex="{ row }">
            {{ getSex(row.sex) }}
          </template>
          <template #age="{ row }">
            {{ getAge(row.birthday) }}
          </template>
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
    <operation-employee
      v-model="operationEmployee.visible"
      v-model:mdl="operationEmployee.mdl"
      :is-edit="operationEmployee.isEdit"
      :school-list="schoolList"
      :company-list="companyList"
      @refresh-list="handleRefreshList"
    >
    </operation-employee>
    <import-employee v-model="importVisible" @refresh-list="handleRefreshList"></import-employee>
  </div>
</template>
<script lang="ts">
export default {
  name: 'EmployeeList',
};
</script>
<script setup lang="ts">
import type { PageInfo, PrimaryTableCol } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { onMounted, reactive, ref } from 'vue';

import { deleteEmployee, getList } from '@/api/employee';
import { getOrganizationTree } from '@/api/organization';
import { useTable } from '@/composeable/useTable';
import { OrganizationType } from '@/constants';
import { t } from '@/locales';
import { recursiveMap } from '@/utils/array';
import { getAge } from '@/utils/date';
import { getSex } from '@/utils/string';

import { ImportEmployee, OperationEmployee } from './components';

const tableParentElement = ref(null);
const tableElement = ref(null);
const dataSource = ref([]);

const searchData = reactive({
  organizationIds: [],
  keyword: '',
});

const fetchData = async () => {
  loading.value = true;
  try {
    // @ts-ignore
    const { list, count } = await getList({
      currentPage: pagination.value?.current || 1,
      pageSize: pagination.value?.pageSize || 20,
      keyword: searchData.keyword,
      organizationIds: searchData.organizationIds,
    });
    dataSource.value = list;
    total.value = count;
  } catch {
  } finally {
    loading.value = false;
  }
};
const columns = ref<PrimaryTableCol[]>([
  { colKey: 'name', title: t('pages.employee.name'), width: 100, fixed: 'left' },
  { colKey: 'jobNumber', title: t('pages.employee.jobNumber'), width: 100 },
  { colKey: 'sex', title: t('pages.employee.sex'), width: 50 },
  { colKey: 'age', title: t('pages.employee.age'), width: 50 },
  { colKey: 'idCard', title: t('pages.employee.idCard'), width: 160 },
  { colKey: 'certificateNumber', title: t('pages.employee.certificateNumber'), width: 100 },
  { colKey: 'contact', title: t('pages.employee.contact'), width: 120 },
  { colKey: 'createdDate', title: t('pages.employee.createdDate'), width: 160 },
  { colKey: 'updatedDate', title: t('pages.employee.updatedDate'), width: 160 },
  { colKey: 'operation', title: t('pages.record.operation.label'), width: 100, fixed: 'right' },
]);
const rowKey = 'id';
const verticalAlign = 'top' as const;
const total = ref(0);
const loading = ref(true);

const organizationList = ref([]);
const schoolList = ref([]);
const companyList = ref([]);

onMounted(() => {
  fetchData();
  getOrganizationTree({}).then((res: any) => {
    organizationList.value = recursiveMap(res.list, (item: any) => ({
      type: item.type,
      label: item.name,
      title: item.name,
      value: item.id,
    }));
    organizationList.value.forEach((item) => {
      if (item.type === OrganizationType.School) {
        schoolList.value = item.children;
      } else {
        companyList.value = item.children;
      }
    });
  });
});

const { pagination, isEmpty, loadingProps, tableHeight, tableKey } = useTable({
  total,
  table: tableElement,
  parent: tableParentElement,
  loading,
});

const operationEmployee = reactive({
  visible: false,
  isEdit: false,
  mdl: undefined,
});

const handleShowCreate = () => {
  operationEmployee.mdl = undefined;
  operationEmployee.isEdit = false;
  operationEmployee.visible = true;
};

const handleShowUpdate = (company: any) => {
  operationEmployee.mdl = company;
  operationEmployee.isEdit = true;
  operationEmployee.visible = true;
};

const importVisible = ref(false);
const handleShowImport = () => {
  importVisible.value = true;
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

const handleDeleteConfirm = (row: any) => {
  deleteEmployee(row.id).then(() => {
    fetchData();
    MessagePlugin.success(t('pages.message.delete'));
  });
};

const handleRefreshList = () => {
  fetchData();
};
</script>
<style lang="less" scoped></style>
