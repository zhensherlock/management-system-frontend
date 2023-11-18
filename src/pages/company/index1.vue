<template>
  <div class="record-page">
    <t-card title="title" header-bordered :bordered="false" class="filter-card">
      <label class="filter-card-label">{{ $t('pages.record.filter.label') }}</label>
      <template #actions> </template>
    </t-card>
    <t-card title="title" header-bordered :bordered="false" class="table-card">
      <template #title>
        <i18n-t keypath="pages.record.table.total">
          <template #number>
            <em>111</em>
          </template>
        </i18n-t>
      </template>
      <template #actions> </template>
      <template v-if="isEmpty">
        <result type="empty" :title="$t('pages.record.empty.title')" :tip="$t('pages.record.empty.tip')"> </result>
      </template>
      <div v-else class="table">
        <perfect-scrollbar>
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
            :loading="dataLoading"
            :header-affixed-top="headerAffixedTop"
            :horizontal-scroll-affixed-bottom="true"
          >
          </t-table>
        </perfect-scrollbar>
      </div>
    </t-card>
  </div>
</template>
<script lang="ts">
export default {
  name: 'CompanyList',
};
</script>
<script setup lang="ts">
import { computed, ref } from 'vue';

const data = ref([]);
for (let i = 0; i < 100; i++) {
  data.value.push({
    name: 'XXX公司',
    contact: 'XXX',
    phone: 'XXX',
    address: '',
  });
}
const columns = ref([
  { colKey: 'name', title: '公司名称' },
  { colKey: 'contact', title: '联系人' },
  { colKey: 'phone', title: '联系方式' },
  { colKey: 'address', title: '公司地址' },
  { colKey: 'operation', title: '操作' },
]);
const rowKey = 'index';
const verticalAlign = 'top' as const;
const pagination = ref({
  defaultPageSize: 20,
  total: 0,
  defaultCurrent: 1,
  totalContent: false,
});
const dataLoading = ref(false);
const isEmpty = ref(false);
const headerAffixedTop = computed(
  () =>
    ({
      offsetTop: 0,
      container: '.t-table',
    } as any),
);
</script>
<style lang="less" scoped></style>
