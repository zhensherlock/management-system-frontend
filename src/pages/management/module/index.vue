<template>
  <div class="record-page">
    <FilterCard
      title="模块列表"
      v-model="searchData"
      :options="[
        {
          type: 'input',
          name: 'keyword',
          value: '',
          label: $t('pages.module.name'),
          placeholder: $t('pages.form.placeholder', { field: $t('pages.module.name') }),
        },
      ]"
      @submit="handleSearchSubmit"
    >
      <template #actions>
        <t-button size="small" variant="text" theme="primary" class="icon-operation" @click="handleShowCreate">
          <template #icon><span class="t-icon i-material-symbols-add-circle"></span></template>
          {{ $t('pages.module.create') }}
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
          :tree="treeConfig"
          @page-change="handleChangePage"
        >
          <template #icon="{ row }">
            <t-icon :name="row.icon"></t-icon>
          </template>
          <template #enabled="{ row }">
            <t-tag :theme="row.enabled ? 'primary' : 'danger'" variant="light-outline">
              {{ $t(row.enabled ? 'pages.common.status.enabled' : 'pages.common.status.disabled') }}
            </t-tag>
          </template>
          <template #operation="{ row }">
            <t-space align="center" :size="0">
              <t-link hover="color" theme="primary" @click="handleShowAddDialog(row)">
                {{ $t('pages.module.addChild') }}
              </t-link>
              <t-link hover="color" theme="primary" @click="handleShowButtonList(row)">
                {{ $t('pages.module.buttonList') }}
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
        </t-enhanced-table>
      </div>
    </t-card>
    <OperationModule
      v-model="operationModel.visible"
      v-model:mdl="operationModel.mdl"
      :is-edit="operationModel.isEdit"
      :list="dataSource"
      @refresh-list="handleRefreshList"
    >
    </OperationModule>
    <ButtonList
      v-model="buttonList.visible"
      :module="buttonList.module"
    />
  </div>
</template>
<script lang="ts">
export default {
  name: 'ModuleList',
};
</script>
<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
import { useTable } from '@/composeable/useTable';
import { OperationModule, ButtonList } from './components';
import { getModuleTree, deleteModule } from '@/api/module';
import type { PageInfo, PrimaryTableCol } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { t } from '@/locales';

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
    const { list, count } = await getModuleTree({
      keyword: searchData.keyword,
    });
    dataSource.value = list;
    total.value = count;

    await nextTick(() => {
      tableElement.value.expandAll();
    });
  } catch {
  } finally {
    loading.value = false;
  }
};
const columns = ref<PrimaryTableCol[]>([
  { colKey: 'name', title: t('pages.module.name'), width: 200, fixed: 'left' },
  { colKey: 'code', title: t('pages.module.code'), width: 160 },
  { colKey: 'icon', title: t('pages.module.icon'), width: 60 },
  { colKey: 'enabled', title: t('pages.module.enabled'), width: 60 },
  { colKey: 'url', title: t('pages.module.url'), width: 200 },
  { colKey: 'component', title: t('pages.module.component'), width: 300 },
  { colKey: 'target', title: t('pages.module.target'), width: 70 },
  { colKey: 'sequence', title: t('pages.module.sequence'), width: 60 },
  { colKey: 'operation', title: t('pages.record.operation.label'), width: 280, fixed: 'right' },
]);
const rowKey = 'id';
const verticalAlign = 'top' as const;
const total = ref(0);
const loading = ref(true);

onMounted(() => {
  fetchData();
});

const { pagination, isEmpty, loadingProps, tableHeight } = useTable({
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

const handleShowCreate = () => {
  operationModel.mdl = undefined;
  operationModel.isEdit = false;
  operationModel.visible = true;
};

const handleShowAddDialog = (row: any) => {
  operationModel.mdl = {
    parentId: row.id,
    target: '_self',
    icon: 'activity',
    enabled: true,
    sequence: (row?.children?.length || 0) + 1,
  };
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
  deleteModule(row.id).then(() => {
    fetchData();
    MessagePlugin.success(t('pages.message.delete'));
  });
};

const handleRefreshList = async () => {
  await fetchData();
};

const treeConfig = reactive({
  treeNodeColumnIndex: 0,
  indent: 25,
  defaultExpandAll: false,
});

const buttonList = reactive({
  visible: false,
  module: null,
});

const handleShowButtonList = (module: any) => {
  buttonList.visible = true;
  buttonList.module = module;
}
</script>
<style lang="less" scoped>
.data-card {
  :deep(.t-card__body) {
    padding: var(--td-comp-paddingTB) var(--td-comp-paddingLR);
  }
}
</style>
