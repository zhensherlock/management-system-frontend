<template>
  <div class="record-page">
    <FilterCard
      title="用户列表"
      v-model="searchData"
      :options="[
        {
          type: 'cascader',
          name: 'organizationIds',
          value: [],
          label: $t('pages.user.organization'),
          placeholder: $t('pages.form.selectPlaceholder', { field: $t('pages.user.organization') }),
          children: organizationList,
          props: {
            multiple: true,
            valueMode: 'parentFirst',
            'min-collapsed-num': 1,
          },
        },
        {
          type: 'select',
          name: 'roleIds',
          value: [],
          label: $t('pages.user.role'),
          placeholder: $t('pages.form.selectPlaceholder', { field: $t('pages.user.role') }),
          children: roleList,
          props: {
            multiple: true,
            'min-collapsed-num': 1,
          },
        },
        {
          type: 'input',
          name: 'keyword',
          value: '',
          label: $t('pages.user.name'),
          placeholder: $t('pages.form.placeholder', { field: $t('pages.user.name') }),
        },
      ]"
      @submit="handleSearchSubmit"
    >
      <template #actions>
        <t-button size="small" variant="text" theme="primary" class="icon-operation" @click="handleShowCreate">
          <template #icon><span class="t-icon i-material-symbols-add-circle"></span></template>
          {{ $t('pages.user.create') }}
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
          :loadingProps="loadingProps"
          :max-height="tableHeight"
          @page-change="handleChangePage"
        >
          <template #organization="{ row }">
            <OrganizationName :mdl="row.organizationUserMappings"></OrganizationName>
          </template>
          <template #role="{ row }">
            <RoleName :mdl="row.userRoleMappings"></RoleName>
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
    <OperationUser
      v-model="operationModel.visible"
      v-model:mdl="operationModel.mdl"
      :is-edit="operationModel.isEdit"
      :organization-list="organizationList"
      :role-list="roleList"
      :list="dataSource"
      @refresh-list="handleRefreshList"
    >
    </OperationUser>
  </div>
</template>
<script lang="ts">
export default {
  name: 'UserList',
};
</script>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTable } from '@/composeable/useTable';
import { OperationUser } from './components';
import { getUserList, deleteUser } from '@/api/user';
import type { PageInfo, PrimaryTableCol } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { t } from '@/locales';
import { recursiveMap } from '@/utils/array';
import { getOrganizationTree } from '@/api/organization';
import { getRoleList } from '@/api/role';

const tableParentElement = ref(null);
const tableElement = ref(null);
const dataSource = ref([]);

const organizationList = ref([]);
const roleList = ref([]);

const route = useRoute();

const searchData = reactive({
  organizationIds: [],
  roleIds: [],
  keyword: '',
});

const fetchData = async () => {
  loading.value = true;
  try {
    // @ts-ignore
    const { list, count } = await getUserList({
      keyword: searchData.keyword,
      roleIds: searchData.roleIds,
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
  { colKey: 'name', title: t('pages.user.name'), width: 150, fixed: 'left' },
  { colKey: 'realName', title: t('pages.user.realName'), width: 100 },
  { colKey: 'organization', title: t('pages.user.organization'), width: 100 },
  { colKey: 'role', title: t('pages.user.role'), width: 100 },
  { colKey: 'email', title: t('pages.user.email'), width: 160 },
  { colKey: 'tel', title: t('pages.user.tel'), width: 140 },
  { colKey: 'createdDate', title: t('pages.user.createdDate'), width: 160 },
  { colKey: 'updatedDate', title: t('pages.user.updatedDate'), width: 160 },
  { colKey: 'operation', title: t('pages.record.operation.label'), width: 100, fixed: 'right' },
]);
const rowKey = 'id';
const verticalAlign = 'top' as const;
const total = ref(0);
const loading = ref(true);

onMounted(() => {
  Object.keys(route.query).forEach((key) => {
    const value = route.query[key];
    if (key === 'organizationIds') {
      searchData.organizationIds = [value];
    } else {
      // @ts-ignore
      searchData[key] = value;
    }
  });
  fetchData();
  getOrganizationTree().then((res: any) => {
    organizationList.value = recursiveMap(res.list, (item: any) => ({
      type: item.type,
      label: item.name,
      title: item.name,
      value: item.id,
    }));
  });
  getRoleList().then((res: any) => {
    roleList.value = res.list.map((item: any) => ({
      label: item.name,
      title: item.name,
      value: item.id,
    }));
  })
});

const { pagination, isEmpty, loadingProps, tableHeight, tableKey } = useTable({
  total,
  table: tableElement,
  parent: tableParentElement,
  loading,
});

const operationModel = reactive({
  visible: false,
  isEdit: false,
  mdl: undefined,
});

const handleShowCreate = () => {
  operationModel.mdl = undefined;
  if (searchData.organizationIds.length === 1 && searchData.organizationIds[0] === route.query.organizationIds) {
    operationModel.mdl = {
      organizationIds: route.query.organizationIds,
    }
  }
  operationModel.isEdit = false;
  operationModel.visible = true;
};

const handleShowUpdate = (company: any) => {
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
  deleteUser(row.id).then(() => {
    fetchData();
    MessagePlugin.success(t('pages.message.delete'));
  });
};

const handleRefreshList = () => {
  fetchData();
};
</script>
<style lang="less" scoped></style>
