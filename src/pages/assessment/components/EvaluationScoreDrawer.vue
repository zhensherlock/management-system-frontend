<script setup lang="ts">
import { reactive, watch } from 'vue';
import { getDateString } from '@/utils';
import { AssessmentTaskContentTable } from './index';

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
  },
);

const handleClose = () => {
  emits('update:modelValue', false);
};

const saveDraft = reactive({
  loading: false,
});

const saveAndSubmit = reactive({
  loading: false,
});

const handleSaveDraft = () => {};

const handleSaveAndSubmit = () => {};
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
    <template #header v-if="props.mdl.assessmentTask">
      {{ props.mdl.assessmentTask.title }} - {{ $t('pages.evaluationScoreDrawer.header.suffix') }}
    </template>
    <t-descriptions
      bordered
      size="small"
      :column="2"
      :title="$t('pages.evaluationScoreDrawer.basic.title')"
      v-if="props.mdl.assessmentTask"
    >
      <t-descriptions-item :label="$t('pages.evaluationScoreDrawer.basic.date')">
        {{ getDateString(props.mdl.assessmentTask.startDate) }} 至 {{ getDateString(props.mdl.assessmentTask.endDate) }}
      </t-descriptions-item>
      <t-descriptions-item :label="$t('pages.evaluationScoreDrawer.basic.basicScore')">
        {{ props.mdl.assessmentTask.basicScore }}
      </t-descriptions-item>
      <t-descriptions-item :label="$t('pages.evaluationScoreDrawer.basic.description')" :span="2">
        {{ props.mdl.assessmentTask.description || '-' }}
      </t-descriptions-item>
    </t-descriptions>
    <t-descriptions
      size="small"
      :title="$t('pages.evaluationScoreDrawer.content.title')"
    />
    <AssessmentTaskContentTable
      :assessment="props.mdl.assessmentTask"
      :assessment-task-detail="props.mdl"
      mode="evaluation"
    />
    <template #footer>
      <t-button variant="outline" @click="handleSaveDraft" :loading="saveDraft.loading">
        {{ $t('pages.evaluationScoreDrawer.evaluation.save.draft') }}
      </t-button>
      <t-popconfirm
        theme="danger"
        :content="$t('pages.evaluationScoreDrawer.evaluation.save.submitConfirm')"
        @confirm="handleSaveAndSubmit"
      >
        <t-button :loading="saveAndSubmit.loading">{{ $t('pages.evaluationScoreDrawer.evaluation.save.submit') }}</t-button>
      </t-popconfirm>
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
