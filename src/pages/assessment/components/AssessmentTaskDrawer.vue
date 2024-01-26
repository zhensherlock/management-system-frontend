<script setup lang="ts">
import { reactive, watch } from 'vue';
import { t } from '@/locales';
import { PrimaryTableCol } from 'tdesign-vue-next';
import {
  getAssessmentTaskStatus,
  getAssessmentTaskStatusTheme,
  getDateString
} from '@/utils';
import { AssessmentTaskContentTable } from './index';
import { getAssessmentTaskStatistic } from '@/api/assessment_task.api';
import { AssessmentTaskDetailListDrawer } from './index';

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

    getAssessmentTaskStatistic(props.mdl.id).then((res: any) => {
      statistic.total = res.total;
      statistic.submitted = res.submitted;
      statistic.pending = res.pending;
      statistic.returned = res.returned;
      statistic.done = res.done;
      statistic.donePercentage = res.donePercentage;
    });
  },
);

const statistic = reactive({
  total: 0,
  submitted: 0,
  pending: 0,
  returned: 0,
  done: 0,
  donePercentage: 0,
});

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

const assessmentTaskDetailListDrawer = reactive({
  visible: false,
});

const handleShowAssessmentTaskDetail = () => {
  assessmentTaskDetailListDrawer.visible = true;
};
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
      <t-descriptions-item :label="$t('pages.assessment_task.status')">
        <t-tag :theme="getAssessmentTaskStatusTheme(props.mdl.status)" variant="light-outline">
          {{ getAssessmentTaskStatus(props.mdl.status) }}
        </t-tag>
      </t-descriptions-item>
      <t-descriptions-item :label="$t('pages.assessment_task.date')">
        {{ getDateString(props.mdl.startDate) }} 至 {{ getDateString(props.mdl.endDate) }}
      </t-descriptions-item>
      <t-descriptions-item :label="$t('pages.assessment_task.basicScore')">
        {{ props.mdl.basicScore }}
      </t-descriptions-item>
      <t-descriptions-item :label="$t('pages.assessment_task.description')">
        {{ props.mdl.description || '-' }}
      </t-descriptions-item>
    </t-descriptions>
    <t-descriptions size="small" :title="$t('pages.assessment_task.form.gradeSetting.title')" />
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
    <t-descriptions size="small">
      <template #title>
        <t-row style="font: inherit;">
          <t-col flex="100px">
            {{ $t('pages.assessment_task.process.title') }}
          </t-col>
          <t-col flex="auto" class="text-right">
            <t-button size="small" variant="text" theme="primary" class="icon-operation" @click="handleShowAssessmentTaskDetail">
              <template #icon><span class="t-icon i-material-symbols-list-alt"></span></template>
              {{ $t('pages.assessment_task.statistic.header.detailButton') }}
            </t-button>
          </t-col>
        </t-row>
      </template>
    </t-descriptions>
    <t-card bordered>
      <t-space class="w-100% text-center" align="center">
        <t-statistic
          :title="$t('pages.assessment_task.statistic.header.total')"
          :unit="$t('pages.assessment_task.statistic.header.schoolUnit')"
          :value="statistic.total"
          color="black"
        />
        <t-statistic
          :title="$t('pages.assessment_task.statistic.header.submitted')"
          :unit="$t('pages.assessment_task.statistic.header.schoolUnit')"
          :value="statistic.submitted"
          color="blue"
        />
        <t-statistic
          :title="$t('pages.assessment_task.statistic.header.pending')"
          :unit="$t('pages.assessment_task.statistic.header.schoolUnit')"
          :value="statistic.pending"
          color="orange"
        />
        <t-statistic
          :title="$t('pages.assessment_task.statistic.header.returned')"
          :unit="$t('pages.assessment_task.statistic.header.schoolUnit')"
          :value="statistic.returned"
          color="red"
        />
        <t-statistic
          :title="$t('pages.assessment_task.statistic.header.donePercentage')"
          :decimal-places="2"
          :value="statistic.donePercentage"
          unit="%"
          color="green"
        />
        <template #separator>
          <t-divider class="h-66px" layout="vertical" />
        </template>
      </t-space>
      <template #footer>
        <t-progress status="success" class="progress" :percentage="statistic.donePercentage" :label="false" />
      </template>
    </t-card>
    <t-descriptions
      size="small"
      :title="$t('pages.assessment_task.content')"
    />
    <AssessmentTaskContentTable :assessment="props.mdl" />
    <AssessmentTaskDetailListDrawer v-model="assessmentTaskDetailListDrawer.visible" :mdl="props.mdl" />
    <template #footer>
      <t-button>
        {{ $t('pages.assessment_task.done.button') }}
      </t-button>
    </template>
  </t-drawer>
</template>

<style scoped lang="less">
.t-descriptions {
  --td-component-border: #E4EEF6;

  &:not(:first-child) {
    margin-top: var(--td-comp-margin-m);
  }

  :deep(.t-descriptions__body) {
    width: 100%;
  }

  :deep(.t-descriptions__label) {
    background-color: #F2F9FC;
  }
}

.t-card {
  --td-component-border: #E4EEF6;
  border-radius: 0 0 var(--td-radius-medium) var(--td-radius-medium);

  :deep(.t-card__footer) {
    padding: 0;

    .t-progress__info {
      display: none;
    }
  }
}

.t-table {
  :deep(.t-table__content) {
    border-radius: 0;
  }
}

.progress {
  position: relative;
  bottom: -1px;
  :deep(.t-progress__bar) {
    border-radius: 0 0 var(--td-radius-medium) var(--td-radius-medium);

    .t-progress__inner {
      border-radius: 0 0 0 var(--td-radius-medium);
    }
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
