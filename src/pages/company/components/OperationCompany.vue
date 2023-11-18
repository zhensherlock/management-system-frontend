<script setup lang="ts">
import { ref, toRaw, watch } from 'vue';
import { useCloned } from '@vueuse/core';
import _ from 'lodash';
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
const emits = defineEmits(['update:modelValue'])

const form = ref(null)

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

const handleSubmit = ({ validateResult }) => {
  if (validateResult === true) {
    _.merge(props.mdl, toRaw(formData.value));
    handleClose();
  }
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
      {{ isEdit ? $t('pages.company.update') : $t('pages.company.create') }}
    </template>
    <t-form ref="form" :data="formData" scroll-to-first-error="smooth" labelWidth="90px" @submit="handleSubmit">
      <t-form-item
        :label="$t('pages.company.name')"
        name="name"
        :rules="[
          { required: true, message: $t('pages.form.requiredText', { field: $t('pages.company.name') }), type: 'error', trigger: 'change' },
          { whitespace: true, message: $t('pages.form.whitespaceText', { field: $t('pages.company.name') }), type: 'error', trigger: 'change' },
        ]"
      >
        <t-input
          v-model="formData.name"
          clearable
          :maxlength="255"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.company.name') })"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.company.person')"
        name="person"
        :rules="[
          { required: true, message: $t('pages.form.requiredText', { field: $t('pages.company.person') }), type: 'error', trigger: 'change' },
          { whitespace: true, message: $t('pages.form.whitespaceText', { field: $t('pages.company.person') }), type: 'error', trigger: 'change' },
        ]"
      >
        <t-input
          v-model="formData.person"
          clearable
          :maxlength="40"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.company.person') })"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.company.contact')"
        name="contact"
        :rules="[
          { required: true, message: $t('pages.form.requiredText', { field: $t('pages.company.contact') }), type: 'error', trigger: 'change' },
          { whitespace: true, message: $t('pages.form.whitespaceText', { field: $t('pages.company.contact') }), type: 'error', trigger: 'change' },
        ]"
      >
        <t-input
          v-model="formData.contact"
          clearable
          :maxlength="40"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.company.contact') })"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.company.address')"
        name="address"
        :rules="[
          { required: true, message: $t('pages.form.requiredText', { field: $t('pages.company.address') }), type: 'error', trigger: 'change' },
          { whitespace: true, message: $t('pages.form.whitespaceText', { field: $t('pages.company.address') }), type: 'error', trigger: 'change' },
        ]"
      >
        <t-textarea
          v-model="formData.address"
          clearable
          :maxlength="255"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.company.address') })"
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
