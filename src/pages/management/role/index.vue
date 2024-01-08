<template>
  <div class="record-page">
    <FilterCard
      title="角色管理"
      v-model="searchData"
      :options="[
        {
          type: 'input',
          name: 'keyword',
          value: '',
          label: $t('pages.role.name'),
          placeholder: $t('pages.form.placeholder', { field: $t('pages.role.name') }),
        },
      ]"
      @submit="handleSearchSubmit"
    >
      <template #actions>
        <t-button size="small" variant="text" theme="primary" class="icon-operation" @click="handleShowCreate">
          <template #icon><span class="t-icon i-material-symbols-add-circle"></span></template>
          {{ $t('pages.role.create') }}
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
          <template #enabled="{ row }">
            <t-tag :theme="row.enabled ? 'primary' : 'danger'" variant="light-outline">
              {{ $t(row.enabled ? 'pages.common.status.enabled' : 'pages.common.status.disabled') }}
            </t-tag>
          </template>
          <template #operation="{ row }">
            <t-space align="center" :size="0">
              <t-link hover="color" theme="primary" @click="handleRedirectUserList(row)">
                {{ $t('pages.role.userList') }}
              </t-link>
              <t-link hover="color" theme="primary" @click="handleShowPermission(row)">
                {{ $t('pages.role.permissionSetting') }}
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
    <OperationRole
      v-model="operationRole.visible"
      :is-edit="operationRole.isEdit"
      v-model:mdl="operationRole.mdl"
      @refresh-list="handleRefreshList"
    >
    </OperationRole>
    <PermissionSetting
      v-model="permissionSetting.visible"
      :role="permissionSetting.role"
      @refresh-list="handleRefreshList"
    >
    </PermissionSetting>
  </div>
</template>
<script lang="ts">
export default {
  name: 'RoleList',
};
</script>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTable } from '@/composeable/useTable';
import { OperationRole, PermissionSetting } from './components';
import { getRoleList, deleteRole } from '@/api/role';
import type { PageInfo, PrimaryTableCol } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { t } from '@/locales';

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
    const { list, count } = await getRoleList({
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
  { colKey: 'name', title: t('pages.role.name'), minWidth: 200 },
  { colKey: 'code', title: t('pages.role.code'), minWidth: 70 },
  { colKey: 'enabled', title: t('pages.role.enabled'), width: 60 },
  { colKey: 'operation', title: t('pages.record.operation.label'), width: 260 },
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

const operationRole = reactive({
  visible: false,
  isEdit: false,
  mdl: undefined,
});

const handleShowCreate = () => {
  operationRole.mdl = undefined;
  operationRole.isEdit = false;
  operationRole.visible = true;
};

const handleRedirectUserList = (row: any) => {
  router.push({
    name: 'AccountManagement',
    query: {
      roleIds: row.id,
    },
  });
};

const handleShowUpdate = (role: any) => {
  operationRole.mdl = role;
  operationRole.isEdit = true;
  operationRole.visible = true;
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
  deleteRole(row.id).then(() => {
    fetchData();
    MessagePlugin.success(t('pages.message.delete'));
  });
};

const permissionSetting = reactive({
  visible: false,
  role: undefined,
});

const handleShowPermission = (row: any) => {
  permissionSetting.visible = true;
  permissionSetting.role = row;
}

const handleRefreshList = () => {
  fetchData();
};
</script>
<style lang="less" scoped></style>
