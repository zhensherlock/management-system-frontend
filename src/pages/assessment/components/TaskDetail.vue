<script setup lang="ts">
import { reactive, watch } from 'vue';
import { t } from '@/locales';
import {
  PrimaryTableCol,
} from 'tdesign-vue-next';
import {
  getAssessmentTaskStatus,
  getAssessmentTaskStatusTheme,
  getDateString
} from '@/utils';
import AssessmentTable from './AssessmentTable.vue'

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
    gradeSetting.dataSource = props.mdl.gradeSetting?.list || [];
  },
);

const handleClose = () => {
  emits('update:modelValue', false);
};

const gradeSetting = reactive({
  dataSource: [],
  columns: [
    {
      colKey: 'grade',
      title: t('pages.assessment_task.form.gradeSetting.table.grade'),
      align: 'center',
    },
    {
      colKey: 'score',
      title: t('pages.assessment_task.form.gradeSetting.table.score'),
      align: 'center',
    },
  ] as PrimaryTableCol[],
});
</script>
<template>
  <t-drawer
    :visible="props.modelValue"
    v-bind="$attrs"
    :closeBtn="true"
    :closeOnOverlayClick="false"
    :preventScrollThrough="true"
    :size-draggable="true"
    :destroyOnClose="true"
    size="1000px"
    @close="handleClose"
    class="task-detail-drawer"
  >
    <template #header>
      {{ props.mdl.title }}
    </template>
    <t-descriptions
      bordered
      size="small"
      :column="2"
      :title="$t('pages.assessment_task.form.basic.title')"
    >
      <t-descriptions-item
        :label="$t('pages.assessment_task.title')"
      >
        {{ props.mdl.title || '-' }}
      </t-descriptions-item>
      <t-descriptions-item
        :label="$t('pages.assessment_task.date')"
      >
        {{ getDateString(props.mdl.startDate) }} 至 {{ getDateString(props.mdl.endDate) }}
      </t-descriptions-item>
      <t-descriptions-item
        :label="$t('pages.assessment_task.status')"
      >
        <t-tag :theme="getAssessmentTaskStatusTheme(props.mdl.status)" variant="light-outline">
          {{ getAssessmentTaskStatus(props.mdl.status) }}
        </t-tag>
      </t-descriptions-item>
      <t-descriptions-item
        :label="$t('pages.assessment_task.basicScore')"
      >
        {{ props.mdl.basicScore }}
      </t-descriptions-item>
      <t-descriptions-item
        :label="$t('pages.assessment_task.description')"
        :span="2"
      >
        {{ props.mdl.description || '-' }}
      </t-descriptions-item>
    </t-descriptions>
    <t-descriptions
      size="small"
      :title="$t('pages.assessment_task.form.gradeSetting.title')"
    />
    <t-table
      bordered
      row-key="id"
      table-layout="fixed"
      cell-empty-content="-"
      size="small"
      :columns="gradeSetting.columns"
      :data="gradeSetting.dataSource"
      :max-height="400"
    >
      <template #score="{ row }">
        <div style="line-height: 24px;">
          {{ row.score.join(' - ') }}
        </div>
      </template>
    </t-table>
<!--    <t-descriptions-->
<!--      size="small"-->
<!--      :title="$t('pages.assessment_task.process.title')"-->
<!--    />-->
    <t-descriptions
      size="small"
      :title="$t('pages.assessment_task.content')"
    />
    <AssessmentTable :assessment="props.mdl" />
    <template #footer>
      <t-button variant="outline">
        {{ $t('pages.assessment_task.save.draft') }}
      </t-button>
    </template>
  </t-drawer>
</template>

<style scoped lang="less">
.t-descriptions {
  &:not(:first-child) {
    margin-top: var(--td-comp-margin-m);
  }

  :deep(.t-descriptions__body) {
    width: 100%;
  }
}

:global(.task-detail-drawer .t-drawer__header) {
  position: relative;
}

:global(.task-detail-drawer .t-drawer__header:before) {
  content: '';
  position: absolute;
  top: calc(100% + 1px);
  height: var(--td-comp-paddingTB-l);
  background: #fff;
  width: calc(100% - var(--td-comp-paddingLR-l));
  left: 0;
  z-index: 100;
}
</style>
