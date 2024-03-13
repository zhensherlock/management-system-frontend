<script setup lang="ts">
import {computed, reactive, ref, watch} from 'vue';
import {getAssessmentTaskStatus, getAssessmentTaskStatusTheme, getDateString} from '@/utils';
import { AssessmentTaskContentTable } from './index';
import { evaluationScore } from '@/api/assessment_task_detail.api';
import {MessagePlugin} from 'tdesign-vue-next';
import {t} from '@/locales';
import {AssessmentTaskDetailStatus} from '@/constants';
import { InfoCircleFilledIcon } from 'tdesign-icons-vue-next';

const props = defineProps({
  modelValue: Boolean,
  mdl: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(['update:modelValue', 'refresh-list']);

watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue) {
      return;
    }
  },
);

const assessmentTaskContentTableRef = ref();

const handleClose = () => {
  emits('update:modelValue', false);
};

const saveDraft = reactive({
  loading: false,
});

const saveAndSubmit = reactive({
  loading: false,
});

const handleSaveDraft = () => {
  saveDraft.loading = true;
  const scoreContent = assessmentTaskContentTableRef.value.getNewScoreContent();
  evaluationScore(props.mdl.id, {
    isDraft: true,
    scoreContent,
  }).then(() => {
    props.mdl.scoreContent = scoreContent;
    MessagePlugin.success(t('pages.message.save'));
  }).finally(() => {
    saveDraft.loading = false;
  });
};

const handleSaveAndSubmit = () => {
  saveAndSubmit.loading = true;
  const scoreContent = assessmentTaskContentTableRef.value.getNewScoreContent();
  evaluationScore(props.mdl.id, {
    isDraft: false,
    scoreContent,
  }).then(() => {
    emits('refresh-list');
    handleClose();
    MessagePlugin.success(t('pages.message.submit'));
  }).finally(() => {
    saveAndSubmit.loading = false;
  });
};

const editable = computed(() => {
  return [AssessmentTaskDetailStatus.Pending, AssessmentTaskDetailStatus.Returned].includes(props.mdl.status);
})
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
    :footer="editable"
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
      <t-descriptions-item :label="$t('pages.evaluationScoreDrawer.basic.status')">
        <t-tag :theme="getAssessmentTaskStatusTheme(props.mdl.assessmentTask.status)" variant="light-outline">
          {{ getAssessmentTaskStatus(props.mdl.assessmentTask.status) }}
        </t-tag>
      </t-descriptions-item>
      <t-descriptions-item :label="$t('pages.evaluationScoreDrawer.basic.date')">
        {{ getDateString(props.mdl.assessmentTask.startDate) }} 至 {{ getDateString(props.mdl.assessmentTask.endDate) }}
      </t-descriptions-item>
      <t-descriptions-item :label="$t('pages.evaluationScoreDrawer.basic.basicScore')">
        {{ props.mdl.assessmentTask.basicScore }}
      </t-descriptions-item>
      <t-descriptions-item :label="$t('pages.evaluationScoreDrawer.basic.description')">
        {{ props.mdl.assessmentTask.description || '-' }}
      </t-descriptions-item>
    </t-descriptions>
    <t-descriptions
      bordered
      size="small"
      :column="2"
      :title="$t('pages.evaluationScoreDrawer.submit.title')"
      v-if="!editable && props.mdl.submitUser"
    >
      <t-descriptions-item :label="$t('pages.evaluationScoreDrawer.submit.user')">
        <t-space :size="4">
          {{ props.mdl.submitUser.name }}
          <t-popup placement="right" trigger="hover" :showArrow="true" :content="props.mdl.submitUser.realName">
            <info-circle-filled-icon size="16px" class="text-#d8d8d8 cursor-pointer" />
          </t-popup>
        </t-space>
      </t-descriptions-item>
      <t-descriptions-item :label="$t('pages.evaluationScoreDrawer.submit.time')">
        {{ props.mdl.submitDate }}
      </t-descriptions-item>
      <t-descriptions-item :label="$t('pages.evaluationScoreDrawer.submit.result')" :span="2">
        <i18n-t keypath="pages.assessmentTaskContentTable.summary">
          <template #totalScore>
            <span class="t-link--theme-primary">{{ props.mdl.totalScore || 0 }}</span>
          </template>
          <template #totalSubtractScore>
            <span class="t-link--theme-success">{{ props.mdl.totalSubtractScore || 0 }}</span>
          </template>
          <template #totalAddScore>
            <span class="t-link--theme-danger">{{ props.mdl.totalAddScore || 0 }}</span>
          </template>
          <template #grade>
            <span class="t-link--theme-warning">{{ props.mdl.grade || '-' }}</span>
          </template>
        </i18n-t>
      </t-descriptions-item>
    </t-descriptions>
    <t-descriptions
      size="small"
      :title="$t('pages.evaluationScoreDrawer.content.title')"
    />
    <AssessmentTaskContentTable
      ref="assessmentTaskContentTableRef"
      v-if="props.mdl.assessmentTask"
      :assessment="props.mdl.assessmentTask"
      :score-content="props.mdl.scoreContent"
      :mode="editable ? 'evaluation' : 'review'"
    />
    <template #footer v-if="editable">
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
    width: 15%;
  }

  :deep(.t-descriptions__content) {
    &:nth-child(2) {
      width: 20%;
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
