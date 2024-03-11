<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { getAssessmentTaskDetails } from '@/api/assessment_task.api';
import { DateRangePickerPanel, type PageInfo, PrimaryTableCol } from 'tdesign-vue-next';
import { t } from '@/locales';
import { getAssessmentTaskDetailStatus, getAssessmentTaskDetailStatusTheme } from '@/utils';
import { AssessmentTaskDetailInfoDrawer } from './index';
import { useTable } from '@/composeable';
// import { AssessmentTaskDetailStatusList } from '@/constants';

const props = defineProps({
  modelValue: Boolean,
  mdl: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(['update:modelValue']);

watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue) {
      return;
    }
    fetchData();
  },
);

const columns = ref<PrimaryTableCol[]>([
  { colKey: 'school', title: t('pages.assessmentTaskDetail.table.school'), minWidth: 200 },
  {
    colKey: 'score',
    title: t('pages.assessmentTaskDetail.table.score'),
    width: 320,
    // sorter: true,
  },
  {
    colKey: 'status',
    title: t('pages.assessmentTaskDetail.table.status'),
    width: 100,
    // filter: {
    //   type: 'multiple',
    //   resetValue: [],
    //   list: AssessmentTaskDetailStatusList,
    //   popupProps: {
    //   },
    //   showConfirmAndReset: true,
    // },
  },
  {
    colKey: 'submitDate',
    title: t('pages.assessmentTaskDetail.table.submitDate'),
    width: 170,
  //   sorter: true,
  //   filter: {
  //     component: DateRangePickerPanel,
  //     props: {
  //       firstDayOfWeek: 7,
  //     },
  //     style: { fontSize: '14px' },
  //     classNames: 'custom-class-name',
  //     attrs: { 'data-type': 'date-range-picker' },
  //     // 是否显示重置取消按钮，一般情况不需要显示
  //     showConfirmAndReset: true,
  //     resetValue: [],
  //   },
  },
  { colKey: 'operation', title: t('pages.record.operation.label'), width: 100, align: 'center' },
]);
const dataSource = ref([]);
const total = ref(0);
const loading = ref(true);
const filterValue = ref([]);
const tableParentElement = ref(null);
const tableElement = ref(null);

const fetchData = async () => {
  loading.value = true;
  try {
    // @ts-ignore
    const { list, count } = await getAssessmentTaskDetails(props.mdl.id, {
      currentPage: pagination.value?.current || 1,
      pageSize: pagination.value?.pageSize || 20,
    });
    dataSource.value = [...list];
    total.value = count;
  } catch {
  } finally {
    loading.value = false;
  }
}

const assessmentTaskDetailInfoDrawer = reactive({
  visible: false,
  mdl: undefined,
});

const handleShowInfo = (mdl: any) => {
  assessmentTaskDetailInfoDrawer.visible = true;
  assessmentTaskDetailInfoDrawer.mdl = mdl;
};

const onFilterChange = () => {};

// const onFilterChange = (filters, ctx) => {
//   console.log('filter-change', filters, ctx);
//   filterValue.value = {
//     ...filters,
//     createTime: filters.createTime || [],
//     channel: filters.channel || [],
//   };
//   console.log(filters);
//   // request(filters);
// };

const { pagination, loadingProps } = useTable({
  total,
  table: tableElement,
  parent: tableParentElement,
  loading,
});

const headerAffixedTopProps = computed(() => {
  return {
    offsetTop: 16,
    container: '.task-detail-drawer .t-drawer__body',
  };
});

const footerAffixedBottomProps = computed(() => {
  return {
    offsetBottom: 16,
    container: '.task-detail-drawer .t-drawer__body',
  };
});

const handleChangePage = (pageInfo: PageInfo) => {
  if (!pagination) {
    return;
  }
  pagination.value.current = pageInfo.current;
  pagination.value.pageSize = pageInfo.pageSize;
  fetchData();
};

const handleClose = () => {
  emits('update:modelValue', false);
};
</script>
<template>
  <t-drawer
    v-bind="$attrs"
    :visible="props.modelValue"
    :closeBtn="true"
    :closeOnOverlayClick="false"
    :preventScrollThrough="true"
    :size-draggable="true"
    :destroyOnClose="true"
    :footer="false"
    size="1000px"
    @close="handleClose"
    class="task-detail-drawer"
  >
    <template #header>
      {{ props.mdl.title }} - {{ $t('pages.assessment_task.statistic.header.detailButton') }}
    </template>
    <div ref="tableParentElement">
      <t-table
        ref="tableElement"
        bordered
        size="small"
        row-key="id"
        cell-empty-content="-"
        :columns="columns"
        :data="dataSource"
        :filter-value="filterValue"
        :pagination="pagination"
        :loading="loading"
        :loading-props="loadingProps"
        :header-affixed-top="headerAffixedTopProps"
        :footer-affixed-bottom="footerAffixedBottomProps"
        @filter-change="onFilterChange"
        @page-change="handleChangePage"
      >
        <template #school="{ row }">
          {{ row.receiveSchoolOrganization.name }}
        </template>
        <template #status="{ row }">
          <t-tag :theme="getAssessmentTaskDetailStatusTheme(row.status)" variant="light-outline">
            {{ getAssessmentTaskDetailStatus(row.status) }}
          </t-tag>
        </template>
        <template #score="{ row }">
          <i18n-t keypath="pages.assessmentTaskContentTable.summary" v-if="row.totalScore">
            <template #totalScore>
              <span class="t-link--theme-primary">{{ row.totalScore }}</span>
            </template>
            <template #totalSubtractScore>
              <span class="t-link--theme-success">{{ row.totalSubtractScore }}</span>
            </template>
            <template #totalAddScore>
              <span class="t-link--theme-danger">{{ row.totalAddScore }}</span>
            </template>
            <template #grade>
              <span class="t-link--theme-warning">{{ row.grade }}</span>
            </template>
          </i18n-t>
          <template v-else>-</template>
        </template>
        <template #operation="{ row }">
          <t-space align="center" :size="0">
            <t-link hover="color" theme="primary" @click="handleShowInfo(row)">
              {{ $t('pages.record.operation.detail') }}
            </t-link>
            <template #separator>
              <t-divider layout="vertical" />
            </template>
          </t-space>
        </template>
      </t-table>
    </div>
    <AssessmentTaskDetailInfoDrawer
      v-model="assessmentTaskDetailInfoDrawer.visible"
      :mdl="assessmentTaskDetailInfoDrawer.mdl"
    />
  </t-drawer>
</template>

<style scoped lang="less">
</style>
