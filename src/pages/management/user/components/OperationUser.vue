<script setup lang="ts">
import type { FormInstanceFunctions, SubmitContext } from 'tdesign-vue-next';
import { ref, watch } from 'vue';
import { useCloned } from '@vueuse/core';
import _ from 'lodash';
import { createCompany, updateCompany } from '@/api/company';
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
        person: '',
        contact: '',
        address: '',
      }
    }
  }
})
const emits = defineEmits(['update:modelValue', 'refresh-list'])

const form = ref<FormInstanceFunctions>()

let { cloned: formData } = useCloned(props.mdl)

watch(() => props.modelValue, () => {
  if (!props.modelValue) {
    return
  }
  formData = useCloned(props.mdl).cloned
});

const handleConfirm = () => {
  form.value.submit();
}

const handleSubmit = ({ validateResult }: SubmitContext) => {
  if (validateResult !== true) {
    return
  }
  if (props.isEdit) {
    handleEditSubmit()
  } else {
    handleCreateSubmit()
  }
}

const handleEditSubmit = () => {
  const params = {
    name: formData.value.name,
    person: formData.value.person,
    contact: formData.value.contact,
    address: formData.value.address,
  }
  updateCompany(formData.value.id, params).then(() => {
    _.merge(props.mdl, params);
    handleClose();
    MessagePlugin.success(t('pages.message.update'));
  })
}

const handleCreateSubmit = () => {
  const params = {
    name: formData.value.name,
    person: formData.value.person,
    contact: formData.value.contact,
    address: formData.value.address,
  }
  createCompany(params).then(() => {
    emits('refresh-list');
    handleClose();
    MessagePlugin.success(t('pages.message.create'));
  })
}

const handleClose = () => {
  emits('update:modelValue', false)
}
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
      {{ isEdit ? $t('pages.user.update') : $t('pages.user.create') }}
    </template>
    <t-form ref="form" :data="formData" scroll-to-first-error="smooth" labelWidth="90px" @submit="handleSubmit">
      <t-form-item
        :label="$t('pages.user.name')"
        name="name"
        :rules="[
          { required: true, message: $t('pages.form.requiredText', { field: $t('pages.user.name') }), type: 'error', trigger: 'change' },
          { whitespace: true, message: $t('pages.form.whitespaceText', { field: $t('pages.user.name') }), type: 'error', trigger: 'change' },
        ]"
      >
        <t-input
          autofocus
          v-model="formData.name"
          clearable
          :maxlength="255"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.user.name') })"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.user.password')"
        name="person"
        :rules="[
          { required: true, message: $t('pages.form.requiredText', { field: $t('pages.user.password') }), type: 'error', trigger: 'change' },
          { whitespace: true, message: $t('pages.form.whitespaceText', { field: $t('pages.user.password') }), type: 'error', trigger: 'change' },
        ]"
      >
        <t-input
          v-model="formData.password"
          clearable
          :maxlength="40"
          type="password"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.user.password') })"
        >
        </t-input>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<style scoped lang="less">
.t-form {
  margin-bottom: var(--td-comp-margin-xs);
}
</style>
