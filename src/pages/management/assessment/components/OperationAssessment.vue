<script setup lang="ts">
import type { FormInstanceFunctions, SubmitContext } from 'tdesign-vue-next';
import { ref, watch, computed } from 'vue';
import { useCloned } from '@vueuse/core';
import _ from 'lodash';
import { createAssessment, updateAssessment } from '@/api/assessment';
import { MessagePlugin } from 'tdesign-vue-next';
import { t } from '@/locales';
import { recursiveMap } from '@/utils/array';
import { AssessmentScoreType, AssessmentScoreTypeList } from '@/constants';

const props = defineProps({
  modelValue: Boolean,
  isEdit: Boolean,
  mdl: {
    type: Object,
    default() {
      return {
        title: '',
        parentId: null,
        sequence: 1,
        description: '',
        scoreType: AssessmentScoreType.Add,
        maximumScore: 100,
        scoreStep: 1,
      };
    },
  },
  list: {
    type: Array,
    default: () => [],
  },
});
const emits = defineEmits(['update:modelValue', 'refresh-list']);

const form = ref<FormInstanceFunctions>();

const assessmentTreeData = computed(() => {
  return recursiveMap(props.list, (item: any) => ({
    label: item.title,
    title: item.title,
    value: item.id,
  }));
});

let { cloned: formData } = useCloned(props.mdl);

watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue) {
      return;
    }
    formData = useCloned(props.mdl).cloned;
    if (!formData.value.parentId) {
      // 添加考核的初始事件
      formData.value.parentId = (props.list[0] as any)?.id;
    } else {
      // 添加考核子集的初始事件
    }
  },
);

const handleConfirm = () => {
  form.value.submit();
};

const handleSubmit = ({ validateResult }: SubmitContext) => {
  if (validateResult !== true) {
    return;
  }
  if (props.isEdit) {
    handleEditSubmit();
  } else {
    handleCreateSubmit();
  }
};

const handleEditSubmit = () => {
  const params = {
    title: formData.value.title,
    sequence: formData.value.sequence,
    scoreType: formData.value.scoreType,
    maximumScore: formData.value.maximumScore,
    scoreStep: formData.value.scoreStep,
    parentId: formData.value.parentId,
  };
  updateAssessment(formData.value.id, params).then(() => {
    _.merge(props.mdl, params);
    handleClose();
    MessagePlugin.success(t('pages.message.update'));
  });
};

const handleCreateSubmit = () => {
  const params = {
    title: formData.value.title,
    sequence: formData.value.sequence,
    scoreType: formData.value.scoreType,
    maximumScore: formData.value.maximumScore,
    scoreStep: formData.value.scoreStep,
    parentId: formData.value.parentId,
  };
  createAssessment(params).then(() => {
    emits('refresh-list');
    handleClose();
    MessagePlugin.success(t('pages.message.create'));
  });
};

const handleClose = () => {
  emits('update:modelValue', false);
};

const handleParentChange = () => {
  if (_.isEmpty(formData.value.parentId)) {
    formData.value.parentId = null;
  }
};
</script>

<template>
  <t-dialog
    class="dialog"
    :visible="props.modelValue"
    v-bind="$attrs"
    :closeOnOverlayClick="false"
    @close="handleClose"
    :destroyOnClose="true"
    @confirm="handleConfirm"
    width="600px"
  >
    <template #header>
      {{ isEdit ? $t('pages.assessment.update') : $t('pages.assessment.create') }}
    </template>
    <t-form ref="form" :data="formData" scroll-to-first-error="smooth" labelWidth="75px" @submit="handleSubmit">
      <t-form-item
        :label="$t('pages.assessment.title')"
        name="title"
        :rules="$rules.inputRules('pages.assessment.title')"
      >
        <t-input
          autofocus
          v-model="formData.title"
          clearable
          :maxlength="150"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.assessment.title') })"
          @enter="handleConfirm"
        >
        </t-input>
      </t-form-item>
      <t-form-item :label="$t('pages.assessment.parentId')" name="parentId">
        <t-cascader
          clearable
          v-model="formData.parentId"
          :options="assessmentTreeData"
          check-strictly
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.assessment.parentId') })"
          @change="handleParentChange"
        />
      </t-form-item>
      <t-form-item
        :label="$t('pages.assessment.sequence')"
        name="sequence"
        :rules="$rules.inputNumberRules('pages.assessment.sequence', false)"
      >
        <t-input-number
          v-model="formData.sequence"
          clearable
          auto-width
          theme="column"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.assessment.sequence') })"
          @enter="handleConfirm"
        >
        </t-input-number>
      </t-form-item>
      <t-form-item
        :label="$t('pages.assessment.scoreStep')"
        name="scoreStep"
        :rules="$rules.inputNumberRules('pages.assessment.scoreStep', true)"
      >
        <t-input-number
          v-model="formData.scoreStep"
          clearable
          auto-width
          theme="column"
          :min="0"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.assessment.scoreStep') })"
          @enter="handleConfirm"
        >
        </t-input-number>
      </t-form-item>
      <t-form-item
        :label="$t('pages.assessment.score')"
        name="maximumScore"
        :rules="$rules.inputNumberRules('pages.assessment.score', true)"
      >
        <t-input-adornment>
          <template #prepend>
            <t-select autoWidth v-model="formData.scoreType" default-value="tencent">
              <t-option
                v-for="item in AssessmentScoreTypeList"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              />
            </t-select>
          </template>
          <t-input-number
            v-model="formData.maximumScore"
            clearable
            auto-width
            theme="column"
            :placeholder="
              $t('pages.form.placeholder', {
                field: $t(
                  formData.scoreType === AssessmentScoreType.Add
                    ? 'pages.assessment.addMaximumScore'
                    : 'pages.assessment.subtractMaximumScore',
                ),
              })
            "
            @enter="handleConfirm"
          >
          </t-input-number>
        </t-input-adornment>
      </t-form-item>
      <t-form-item
        :label="$t('pages.assessment.description')"
        name="description"
        :rules="$rules.inputRules('pages.assessment.description', false)"
      >
        <t-textarea
          v-model="formData.description"
          clearable
          :maxlength="255"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.assessment.description') })"
        />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<style scoped lang="less">
.t-form {
  margin-bottom: var(--td-comp-margin-xs);
}
</style>
