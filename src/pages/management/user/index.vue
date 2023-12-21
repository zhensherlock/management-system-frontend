<template>
  <div class="record-page">
    <FilterCard
      title="用户列表"
      v-model="searchData"
      :options="[
        {
          type: 'select',
          name: 'companyId',
          value: '',
          label: $t('pages.user.company'),
          placeholder: $t('pages.form.selectPlaceholder', { field: $t('pages.user.company') }),
          children: companyList,
        },
        {
          type: 'cascader',
          name: 'organizationIds',
          value: [],
          label: $t('pages.user.school'),
          placeholder: $t('pages.form.selectPlaceholder', { field: $t('pages.user.school') }),
          children: schoolList,
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
import { useTable } from '@/composeable /useTable';
import { OperationUser } from './components';
import { getUserList, deleteUser } from '@/api/user';
import type { PageInfo, PrimaryTableCol } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { t } from '@/locales';
import { getList as getCompanyList } from '@/api/company';
import { getSchoolTree } from '@/api/school';
import { recursiveMap } from '@/utils/array';

// import { ImportUser, OperationUser } from './components';

const tableParentElement = ref(null);
const tableElement = ref(null);
const dataSource = ref([]);

const companyList = ref([]);
const schoolList = ref([]);

const route = useRoute();

const searchData = ref({
  companyId: null,
  organizationIds: [],
  keyword: '',
});

const fetchData = async () => {
  loading.value = true;
  try {
    // @ts-ignore
    const { list, count } = await getUserList({ keyword: searchData.keyword });
    dataSource.value = list;
    total.value = count;
  } catch {
  } finally {
    loading.value = false;
  }
};
const columns = ref<PrimaryTableCol[]>([
  { colKey: 'name', title: t('pages.user.name') },
  { colKey: 'createdDate', title: t('pages.employee.createdDate'), width: 160 },
  { colKey: 'updatedDate', title: t('pages.employee.updatedDate'), width: 160 },
  { colKey: 'operation', title: t('pages.record.operation.label'), width: 100 },
]);
const rowKey = 'id';
const verticalAlign = 'top' as const;
const total = ref(0);
const loading = ref(true);

onMounted(() => {
  Object.keys(route.query).forEach((key) => {
    const value = route.query[key];
    if (key === 'organizationIds') {
      searchData.value.organizationIds = [value];
    } else {
      // @ts-ignore
      searchData.value[key] = value;
    }
  });
  fetchData();
  getCompanyList({}).then((res: any) => {
    companyList.value = res.list.map((item: any) => ({
      label: item.name,
      title: item.name,
      value: item.id,
    }));
  });
  getSchoolTree({}).then((res: any) => {
    schoolList.value = recursiveMap(res.list, (item: any) => ({
      label: item.name,
      title: item.name,
      value: item.id,
    }));
  });
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
  operationModel.isEdit = false;
  operationModel.visible = true;
};

const handleShowUpdate = (company: any) => {
  operationModel.mdl = company;
  operationModel.isEdit = true;
  operationModel.visible = true;
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
