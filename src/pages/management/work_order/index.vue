<template>
  <div class="record-page">
    <FilterCard
      v-model="searchData"
      :title="pageTitle"
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
      ]"
      @submit="handleSearchSubmit"
    >
      <template #title>
        <t-tabs v-model="status">
          <t-tab-panel value="pending" label="待审批">
          </t-tab-panel>
          <t-tab-panel value="operated" label="已审批">
          </t-tab-panel>
          <t-tab-panel value="" label="全部审批">
          </t-tab-panel>
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
          <template #applyUser="{ row }">
            {{ row.apply.realName }}({{ row.apply.organization }})
          </template>
          <template #auditResult="{ row }">
            <t-tag :theme="getWorkOrderStatusTheme(row.status)" variant="light-outline">
              {{ getWorkOrderStatusLabel(row.status) }}
            </t-tag>
          </template>
          <template #operationContent="{ row }">
            {{ getWorkOrderOperationContent(row.content) }}
          </template>
          <template #operation="{ row }">
            <t-space align="center" :size="0">
              <t-link hover="color" theme="primary" @click="handleShowDetail(row)">
                {{ $t('pages.record.operation.detail') }}
              </t-link>
<!--              <t-popconfirm-->
<!--                theme="danger"-->
<!--                :content="$t('pages.record.operation.deleteConfirm')"-->
<!--                @confirm="handleDeleteConfirm(row)"-->
<!--              >-->
<!--                <t-link hover="color" theme="danger">{{ $t('pages.record.operation.cancel') }}</t-link>-->
<!--              </t-popconfirm>-->
              <template #separator>
                <t-divider layout="vertical" />
              </template>
            </t-space>
          </template>
        </t-table>
      </div>
    </t-card>
    <OperationWorkOrder
      v-model="operationWorkOrder.visible"
      v-model:mdl="operationWorkOrder.mdl"
      @refresh-list="handleRefreshList"
    >
    </OperationWorkOrder>
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
import { usePage } from '@/composeable';
import { getWorkOrderList } from '@/api/work_order';
import { getOrganizationTree } from '@/api/organization';
import { useTable } from '@/composeable/useTable';
import { OrganizationType } from '@/constants';
import { t } from '@/locales';
import { recursiveMap } from '@/utils/array';
import { getWorkOrderStatusLabel, getWorkOrderStatusTheme, getWorkOrderOperationContent } from '@/utils/string';
import { OperationWorkOrder } from './components';

const { pageTitle } = usePage();
const tableParentElement = ref(null);
const tableElement = ref(null);
const dataSource = ref([]);
const status = ref('pending');
const searchData = reactive({
  organizationIds: [],
});

const fetchData = async () => {
  loading.value = true;
  try {
    // @ts-ignore
    const { list, count } = await getWorkOrderList({
      currentPage: pagination.value?.current || 1,
      pageSize: pagination.value?.pageSize || 20,
    });
    dataSource.value = list;
    total.value = count;
  } catch {
  } finally {
    loading.value = false;
  }
};
const columns = ref<PrimaryTableCol[]>([
  { colKey: 'applyUser', title: t('pages.workOrder.applyUser'), width: 300, fixed: 'left' },
  { colKey: 'createdDate', title: t('pages.workOrder.applyTime'), width: 200 },
  { colKey: 'operationContent', title: t('pages.workOrder.operationContent'), width: 200 },
  { colKey: 'auditResult', title: t('pages.workOrder.auditResult'), width: 120 },
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

const operationWorkOrder = reactive({
  visible: false,
  mdl: undefined,
});

const handleShowDetail = (mdl: any) => {
  operationWorkOrder.mdl = mdl;
  operationWorkOrder.visible = true;
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

// const handleDeleteConfirm = (row: any) => {
//   deleteEmployee(row.id).then(() => {
//     fetchData();
//     MessagePlugin.success(t('pages.message.delete'));
//   });
// };

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
