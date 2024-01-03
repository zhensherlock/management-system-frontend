<script setup lang="ts">
import type { FormInstanceFunctions, SubmitContext } from 'tdesign-vue-next';
import { ref, watch } from 'vue';
import { useCloned } from '@vueuse/core';
import _ from 'lodash';
import { createRole, updateRole } from '@/api/role';
import { MessagePlugin } from 'tdesign-vue-next';
import { t } from '@/locales';

const props = defineProps({
  modelValue: Boolean,
  isEdit: Boolean,
  mdl: {
    type: Object,
    default() {
      return {
        name: '',
        code: '',
        enabled: true,
        description: '',
      };
    },
  },
});
const emits = defineEmits(['update:modelValue', 'refresh-list']);

const form = ref<FormInstanceFunctions>();

let { cloned: formData } = useCloned(props.mdl);

watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue) {
      return;
    }
    formData = useCloned(props.mdl).cloned;
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
    name: formData.value.name,
    code: formData.value.code,
    enabled: formData.value.enabled,
    description: formData.value.description,
  };
  updateRole(formData.value.id, params).then(() => {
    // _.merge(props.mdl, params);
    emits('refresh-list');
    handleClose();
    MessagePlugin.success(t('pages.message.update'));
  });
};

const handleCreateSubmit = () => {
  const params = {
    name: formData.value.name,
    code: formData.value.code,
    enabled: formData.value.enabled,
    description: formData.value.description,
  };
  createRole(params).then(() => {
    emits('refresh-list');
    handleClose();
    MessagePlugin.success(t('pages.message.create'));
  });
};

const handleClose = () => {
  emits('update:modelValue', false);
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
      {{ isEdit ? $t('pages.role.update') : $t('pages.role.create') }}
    </template>
    <t-form ref="form" :data="formData" scroll-to-first-error="smooth" labelWidth="90px" @submit="handleSubmit">
      <t-form-item
        :label="$t('pages.role.name')"
        name="name"
        :rules="$rules.inputRules('pages.role.name')"
      >
        <t-input
          autofocus
          v-model="formData.name"
          clearable
          :maxlength="100"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.role.name') })"
          @enter="handleConfirm"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.role.code')"
        name="code"
        :rules="$rules.inputRules('pages.role.code')"
      >
        <t-input
          v-model="formData.code"
          clearable
          :maxlength="100"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.role.code') })"
          @enter="handleConfirm"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.role.enabled')"
        name="enabled"
      >
        <t-switch
          v-model="formData.enabled"
          :label="[$t('pages.common.status.enabled'), $t('pages.common.status.disabled')]"
        />
      </t-form-item>
      <t-form-item
        :label="$t('pages.role.description')"
        name="description"
        :rules="$rules.inputRules('pages.role.description', false)"
      >
        <t-textarea
          v-model="formData.description"
          clearable
          :maxlength="150"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.role.description') })"
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
