<template>
  <div class="record-page">
    <t-card title="保安公司" header-bordered :bordered="false" class="filter-card">
      <div class="filter-body">
        <div class="filter-body-label">{{ $t('pages.record.filter.label') }}</div>
        <div class="filter-body-content">
          <t-form
            ref="form"
            :data="searchData"
            layout="inline"
            labelWidth="0px"
          >
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
      </div>
      <template #actions>
        <t-button size="small" variant="text" theme="primary" class="icon-operation" @click="handleShowImport">
          <template #icon><span class="t-icon i-ic-sharp-cloud-upload"></span></template>{{ $t('pages.company.import') }}
        </t-button>
        <t-button size="small" variant="text" theme="primary" class="icon-operation" @click="handleShowCreate">
          <template #icon><span class="t-icon i-material-symbols-add-circle"></span></template>{{ $t('pages.company.create') }}
        </t-button>
      </template>
    </t-card>
    <t-card header-bordered :bordered="false" class="data-card">
      <template #title>
        <i18n-t keypath="pages.record.table.total">
          <template #number>
            <span class="t-link--theme-danger">111</span>
          </template>
        </i18n-t>
      </template>
      <template #actions>
      </template>
      <template v-if="isEmpty">
        <result
          type="empty"
          :title="$t('pages.record.empty.title')"
          :tip="$t('pages.record.empty.tip')"
        >
        </result>
      </template>
      <div v-else class="data-card-table" ref="tableElement">
        <t-table
          bordered
          hover
          cell-empty-content="-"
          size="small"
          :data="data"
          :columns="columns"
          :row-key="rowKey"
          :vertical-align="verticalAlign"
          :pagination="pagination"
          :loading="loading"
          :loadingProps="loadingProps"
          :max-height="tableHeight"
          :height="tableHeight"
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
          <template #title-slot-operation>
            {{ $t('pages.record.operation.label') }}
          </template>
          <template #operation="{ row }">
            <t-space align="center" :size="0">
              <t-link hover="color" theme="primary" @click="handleShowUpdate(row)">
                {{ $t('pages.record.operation.update') }}
              </t-link>
              <t-popconfirm theme="danger" :content="$t('pages.record.operation.deleteConfirm')">
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
    >
    </OperationCompany>
    <ImportCompany v-model="importVisible"></ImportCompany>
  </div>
</template>
<script lang="ts">
export default {
  name: 'CompanyList',
};
</script>
<script setup lang="ts">
import { ref, reactive } from 'vue';
import { SearchIcon } from 'tdesign-icons-vue-next';
import { useTable } from '@/composeable /useTable';
import { OperationCompany, ImportCompany } from './components';
const tableElement = ref(null)

const searchData = reactive({
  name: '',
});

const data = ref([]);
setTimeout(() => {
  total.value = 100
  for (let i = 0; i < 100; i++) {
    data.value.push({
      name: 'nameXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX公司',
      person: 'personXXX',
      contact: 'contactXXX',
      address: 'addressXXX',
    })
  }
  loading.value = false;
})
const columns = ref([
  { colKey: 'name', title: 'title-slot-name' },
  { colKey: 'person', title: 'title-slot-person' },
  { colKey: 'contact', title: 'title-slot-contact' },
  { colKey: 'address', title: 'title-slot-address' },
  { colKey: 'operation', title: 'title-slot-operation' },
]);
const rowKey = 'index';
const verticalAlign = 'top' as const;
const total = ref(0);
const loading = ref(true);

const { pagination, isEmpty, loadingProps, tableHeight } = useTable({
  total,
  parent: tableElement,
  loading,
})

const operationCompany = reactive({
  visible: false,
  isEdit: false,
  mdl: undefined,
})

const handleShowCreate = () => {
  operationCompany.mdl = undefined;
  operationCompany.isEdit = false;
  operationCompany.visible = true;
}

const handleShowUpdate = (company: any) => {
  operationCompany.mdl = company;
  operationCompany.isEdit = true;
  operationCompany.visible = true;
}

const importVisible = ref(false);
const handleShowImport = () => {
  importVisible.value = true
}
</script>
<style lang="less" scoped>
</style>
