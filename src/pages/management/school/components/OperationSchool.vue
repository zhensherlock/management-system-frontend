<script setup lang="ts">
import type { FormInstanceFunctions, SubmitContext } from 'tdesign-vue-next';
import { ref, watch, computed } from 'vue';
import { useCloned } from '@vueuse/core';
import _ from 'lodash';
import { createSchool, updateSchool } from '@/api/school';
import { MessagePlugin } from 'tdesign-vue-next';
import { t } from '@/locales';
import { recursiveMap } from '@/utils/array';
import { OrganizationCategory, SchoolCategoryTreeData } from '@/constants';

const props = defineProps({
  modelValue: Boolean,
  isEdit: Boolean,
  mdl: {
    type: Object,
    default() {
      return {
        name: '',
        parentId: null,
        category: OrganizationCategory.VirtualOrganization,
        person: '',
        contact: '',
        address: '',
        sequence: 1,
      };
    },
  },
  list: {
    type: Array,
    default: () => [],
  },
});
const emits = defineEmits(['update:modelValue', 'refresh-list']);

const schoolCategoryTreeData = _.clone(SchoolCategoryTreeData);
const form = ref<FormInstanceFunctions>();

const schoolTreeData = computed(() => {
  return recursiveMap(props.list, (item: any) => ({
    label: item.name,
    title: item.name,
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
    if (!props.isEdit && props.list.length > 0) {
      formData.value.parentId = (props.list[0] as any)?.id;
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
    name: formData.value.name,
    person: formData.value.person,
    contact: formData.value.contact,
    address: formData.value.address,
    parentId: formData.value.parentId,
    category: formData.value.category,
    sequence: formData.value.sequence,
  };
  updateSchool(formData.value.id, params).then(() => {
    // _.merge(props.mdl, params);
    emits('refresh-list');
    handleClose();
    MessagePlugin.success(t('pages.message.update'));
  });
};

const handleCreateSubmit = () => {
  const params = {
    name: formData.value.name,
    person: formData.value.person,
    contact: formData.value.contact,
    address: formData.value.address,
    parentId: formData.value.parentId,
    category: formData.value.category,
    sequence: formData.value.sequence,
  };
  createSchool(params).then(() => {
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
      {{ isEdit ? $t('pages.school.update') : $t('pages.school.create') }}
    </template>
    <t-form ref="form" :data="formData" scroll-to-first-error="smooth" labelWidth="90px" @submit="handleSubmit">
      <t-form-item
        :label="$t('pages.school.name')"
        name="name"
        :rules="$rules.inputRules('pages.school.name')"
      >
        <t-input
          autofocus
          v-model="formData.name"
          clearable
          :maxlength="100"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.school.name') })"
          @enter="handleConfirm"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        v-if="!(isEdit && formData.level === 1)"
        :label="$t('pages.school.parentSchool')"
        name="parentId"
        :rules="$rules.selectRules('pages.school.parentSchool')"
      >
        <t-cascader v-model="formData.parentId" :options="schoolTreeData" check-strictly />
      </t-form-item>
      <t-form-item
        :label="$t('pages.school.category')"
        name="category"
        :rules="$rules.selectRules('pages.school.category')"
      >
        <t-cascader
          v-model="formData.category"
          :options="schoolCategoryTreeData"
          :placeholder="$t('pages.form.selectPlaceholder', { field: $t('pages.school.category') })"
        />
      </t-form-item>
      <t-form-item
        :label="$t('pages.school.person')"
        name="person"
        :rules="$rules.inputRules('pages.school.person', false)"
      >
        <t-input
          v-model="formData.person"
          clearable
          :maxlength="40"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.school.person') })"
          @enter="handleConfirm"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.school.contact')"
        name="contact"
        :rules="$rules.inputRules('pages.school.contact', false)"
      >
        <t-input
          v-model="formData.contact"
          clearable
          :maxlength="40"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.school.contact') })"
          @enter="handleConfirm"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.school.sequence')"
        name="sequence"
        :rules="$rules.inputNumberRules('pages.school.sequence', false)"
      >
        <t-input-number
          v-model="formData.sequence"
          clearable
          auto-width
          theme="column"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.school.sequence') })"
          @enter="handleConfirm"
        >
        </t-input-number>
      </t-form-item>
      <t-form-item
        :label="$t('pages.school.address')"
        name="address"
        :rules="$rules.inputRules('pages.school.address', false)"
      >
        <t-textarea
          v-model="formData.address"
          clearable
          :maxlength="150"
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
