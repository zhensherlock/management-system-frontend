<template>
  <div class="record-page">
    <t-card title="学校组织" header-bordered :bordered="false" class="filter-card">
      <div class="filter-body">
        <div class="filter-body-label">{{ $t('pages.record.filter.label') }}</div>
        <div class="filter-body-content">
          <t-form ref="form" :data="searchData" layout="inline" labelWidth="0px" @submit="handleSearchSubmit">
            <t-form-item name="name">
              <t-input
                v-model="searchData.name"
                :label="$t('pages.company.name')"
                :placeholder="$t('pages.form.placeholder', { field: $t('pages.company.name') })"
              >
                <template #suffixIcon>
                  <search-icon :style="{ cursor: 'pointer' }" />
                </template>
              </t-input>
            </t-form-item>
          </t-form>
        </div>
        <div class="filter-body-reset" v-if="resetFilterVisible">
          <t-link theme="primary" hover="color" @click="handleResetFilter">
            <t-space :size="4">
              <swap-icon slot="prefix-icon"></swap-icon>
              重置筛选
            </t-space>
          </t-link>
        </div>
      </div>
      <template #actions>
        <t-button size="small" variant="text" theme="primary" class="icon-operation" @click="handleShowImport">
          <template #icon><span class="t-icon i-ic-sharp-cloud-upload"></span></template
          >{{ $t('pages.company.import') }}
        </t-button>
        <t-button size="small" variant="text" theme="primary" class="icon-operation" @click="handleShowCreate">
          <template #icon><span class="t-icon i-material-symbols-add-circle"></span></template
          >{{ $t('pages.company.create') }}
        </t-button>
      </template>
    </t-card>
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
          <template #title-slot-name>
            {{ $t('pages.company.name') }}
          </template>
          <template #title-slot-person>
            {{ $t('pages.company.person') }}
          </template>
          <template #title-slot-contact>
            {{ $t('pages.company.contact') }}
          </template>
          <template #title-slot-address>
            {{ $t('pages.company.address') }}
          </template>
          <template #title-slot-createdDate>
            {{ $t('pages.company.createdDate') }}
          </template>
          <template #title-slot-updatedDate>
            {{ $t('pages.company.updatedDate') }}
          </template>
          <template #title-slot-operation>
            {{ $t('pages.record.operation.label') }}
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
import { ref, reactive, onMounted, computed } from 'vue';
import _ from 'lodash';
import { SearchIcon, SwapIcon } from 'tdesign-icons-vue-next';
import { useTable } from '@/composeable /useTable';
import { OperationCompany, ImportCompany } from './components';
import { getList, deleteCompany } from '@/api/company';
import type { PageInfo, PrimaryTableCol } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { t } from '@/locales';

const tableParentElement = ref(null);
const tableElement = ref(null);
const dataSource = ref([]);

const searchData = reactive({
  name: '',
  keyword: '',
});

const resetFilterVisible = computed(() => {
  return !_.isEmpty(searchData.keyword);
});

const fetchData = async () => {
  loading.value = true;
  try {
    const { list, count } = await getList({ keyword: searchData.keyword });
    dataSource.value = list;
    total.value = count;
  } catch {
  } finally {
    loading.value = false;
  }
};
const columns = ref<PrimaryTableCol[]>([
  { colKey: 'name', title: 'title-slot-name' },
  { colKey: 'person', title: 'title-slot-person' },
  { colKey: 'contact', title: 'title-slot-contact' },
  { colKey: 'address', title: 'title-slot-address' },
  { colKey: 'createdDate', title: 'title-slot-createdDate', width: 160 },
  { colKey: 'updatedDate', title: 'title-slot-updatedDate', width: 160 },
  { colKey: 'operation', title: 'title-slot-operation', width: 100 },
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
  searchData.keyword = searchData.name;
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

const handleResetFilter = () => {
  searchData.name = '';
  searchData.keyword = '';
  pagination.value && (pagination.value.current = 1);
  fetchData();
};

const handleDeleteConfirm = (row: any) => {
  deleteCompany(row.id).then(() => {
    fetchData();
    MessagePlugin.success(t('pages.message.delete'));
  });
};

const handleRefreshList = () => {
  fetchData();
};
</script>
<style lang="less" scoped></style>
