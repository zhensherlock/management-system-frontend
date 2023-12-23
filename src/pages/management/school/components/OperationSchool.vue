<script setup lang="ts">
import type { FormInstanceFunctions, SubmitContext } from 'tdesign-vue-next';
import { ref, watch, computed } from 'vue';
import { useCloned } from '@vueuse/core';
import _ from 'lodash';
import { createSchool, updateSchool } from '@/api/school';
import { MessagePlugin } from 'tdesign-vue-next';
import { t } from '@/locales';
import {recursiveMap} from "@/utils/array";

const props = defineProps({
  modelValue: Boolean,
  isEdit: Boolean,
  mdl: {
    type: Object,
    default() {
      return {
        name: '',
        parentId: null,
        person: '',
        contact: '',
        address: '',
      }
    }
  },
  list: {
    type: Array,
    default: () => ([])
  }
})
const emits = defineEmits(['update:modelValue', 'refresh-list'])

const form = ref<FormInstanceFunctions>()

const schoolTreeData = computed(() => {
  return recursiveMap(props.list, (item: any) => ({
    label: item.name,
    title: item.name,
    value: item.id,
  }));
});

let { cloned: formData } = useCloned(props.mdl);

watch(() => props.modelValue, () => {
  if (!props.modelValue) {
    return;
  }
  formData = useCloned(props.mdl).cloned;
  if (!props.isEdit && props.list.length > 0) {
    formData.value.parentId = (props.list[0] as any)?.id
  }
});

const handleConfirm = () => {
  form.value.submit();
}

const handleSubmit = ({ validateResult }: SubmitContext) => {
  if (validateResult !== true) {
    return;
  }
  if (props.isEdit) {
    handleEditSubmit();
  } else {
    handleCreateSubmit();
  }
}

const handleEditSubmit = () => {
  const params = {
    name: formData.value.name,
    person: formData.value.person,
    contact: formData.value.contact,
    address: formData.value.address,
    parentId: formData.value.parentId,
  };
  updateSchool(formData.value.id, params).then(() => {
    _.merge(props.mdl, params);
    handleClose();
    MessagePlugin.success(t('pages.message.update'));
  });
}

const handleCreateSubmit = () => {
  const params = {
    name: formData.value.name,
    person: formData.value.person,
    contact: formData.value.contact,
    address: formData.value.address,
    parentId: formData.value.parentId,
  };
  createSchool(params).then(() => {
    emits('refresh-list');
    handleClose();
    MessagePlugin.success(t('pages.message.create'));
  });
}

const handleClose = () => {
  emits('update:modelValue', false);
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
      {{ isEdit ? $t('pages.school.update') : $t('pages.school.create') }}
    </template>
    <t-form ref="form" :data="formData" scroll-to-first-error="smooth" labelWidth="90px" @submit="handleSubmit">
      <t-form-item
        :label="$t('pages.school.name')"
        name="name"
        :rules="[
          { required: true, message: $t('pages.form.requiredText', { field: $t('pages.school.name') }), type: 'error', trigger: 'change' },
          { whitespace: true, message: $t('pages.form.whitespaceText', { field: $t('pages.school.name') }), type: 'error', trigger: 'change' },
        ]"
      >
        <t-input
          autofocus
          v-model="formData.name"
          clearable
          :maxlength="255"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.school.name') })"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        v-if="!(isEdit && formData.level === 1)"
        :label="$t('pages.school.parentSchool')"
        name="parentId"
        :rules="[
          { required: true, message: $t('pages.form.selectPlaceholder', { field: $t('pages.school.parentSchool') }), type: 'error', trigger: 'change' },
        ]"
      >
        <t-cascader
          v-model="formData.parentId"
          :options="schoolTreeData"
          check-strictly
        />
      </t-form-item>
      <t-form-item
        :label="$t('pages.school.person')"
        name="person"
        :rules="[
          { required: false, message: $t('pages.form.requiredText', { field: $t('pages.school.person') }), type: 'error', trigger: 'change' },
          { whitespace: true, message: $t('pages.form.whitespaceText', { field: $t('pages.school.person') }), type: 'error', trigger: 'change' },
        ]"
      >
        <t-input
          v-model="formData.person"
          clearable
          :maxlength="40"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.school.person') })"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.school.contact')"
        name="contact"
        :rules="[
          { required: false, message: $t('pages.form.requiredText', { field: $t('pages.school.contact') }), type: 'error', trigger: 'change' },
          { whitespace: true, message: $t('pages.form.whitespaceText', { field: $t('pages.school.contact') }), type: 'error', trigger: 'change' },
        ]"
      >
        <t-input
          v-model="formData.contact"
          clearable
          :maxlength="40"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.school.contact') })"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.school.address')"
        name="address"
        :rules="[
          { required: false, message: $t('pages.form.requiredText', { field: $t('pages.school.address') }), type: 'error', trigger: 'change' },
          { whitespace: true, message: $t('pages.form.whitespaceText', { field: $t('pages.school.address') }), type: 'error', trigger: 'change' },
        ]"
      >
        <t-textarea
          v-model="formData.address"
          clearable
          :maxlength="255"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.school.address') })"
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
