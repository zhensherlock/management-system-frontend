<script setup lang="ts">
import type { FormInstanceFunctions, SubmitContext } from 'tdesign-vue-next';
import { ref, watch, computed } from 'vue';
import { useCloned } from '@vueuse/core';
import { createModule, updateModule } from '@/api/module';
import { MessagePlugin } from 'tdesign-vue-next';
import { manifest } from 'tdesign-icons-vue-next';
import { t } from '@/locales';
import { recursiveMap } from '@/utils/array';
import { ModuleTargets } from '@/constants/module.constant';

const props = defineProps({
  modelValue: Boolean,
  isEdit: Boolean,
  mdl: {
    type: Object,
    default() {
      return {
        name: '',
        code: '',
        parentId: null,
        icon: 'activity',
        target: '_self',
        component: '',
        url: '',
        enabled: true,
        isLeaf: true,
        expand: true,
        meta: JSON.stringify({}),
        description: '',
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

const form = ref<FormInstanceFunctions>();

// 获取全部图标的列表
const iconOptions = ref(manifest);

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
    formData.value.meta = JSON.stringify(formData.value.meta);
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
    parentId: formData.value.parentId,
    icon: formData.value.icon,
    target: formData.value.target,
    component: formData.value.component,
    url: formData.value.url,
    enabled: formData.value.enabled,
    isLeaf: formData.value.isLeaf,
    expand: formData.value.expand,
    meta: formData.value.meta,
    description: formData.value.description,
    sequence: formData.value.sequence,
  };
  updateModule(formData.value.id, params).then(() => {
    // _.merge(props.mdl, params);
    emits('refresh-list');
    handleClose();
    MessagePlugin.success(t('pages.message.update'));
  });
};

const handleCreateSubmit = () => {
  const params = {
    name: formData.value.name,
    parentId: formData.value.parentId,
    code: formData.value.code,
    icon: formData.value.icon,
    target: formData.value.target,
    component: formData.value.component,
    url: formData.value.url,
    enabled: formData.value.enabled,
    isLeaf: formData.value.isLeaf,
    expand: formData.value.expand,
    meta: JSON.parse(formData.value.meta),
    description: formData.value.description,
    sequence: formData.value.sequence,
  };
  createModule(params).then(() => {
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
    placement="center"
  >
    <template #header>
      {{ isEdit ? $t('pages.module.update') : $t('pages.module.create') }}
    </template>
    <t-form ref="form" :data="formData" scroll-to-first-error="smooth" labelWidth="90px" @submit="handleSubmit">
      <t-form-item
        :label="$t('pages.module.name')"
        name="name"
        :rules="$rules.inputRules('pages.module.name')"
      >
        <t-input
          autofocus
          v-model="formData.name"
          clearable
          :maxlength="100"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.module.name') })"
          @enter="handleConfirm"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.module.parent')"
        name="parentId"
        :rules="$rules.selectRules('pages.module.parent', false)"
      >
        <t-cascader
          clearable
          v-model="formData.parentId"
          :options="schoolTreeData"
          check-strictly
          :placeholder="$t('pages.form.selectPlaceholder', { field: $t('pages.module.parent') })"
        />
      </t-form-item>
      <t-form-item
        :label="$t('pages.module.icon')"
        name="icon"
        :rules="$rules.selectRules('pages.module.icon')"
      >
        <t-select
          clearable
          v-model="formData.icon"
          :placeholder="$t('pages.form.selectPlaceholder', { field: $t('pages.module.icon') })"
          :popup-props="{ overlayInnerStyle: { width: '476px' } }"
        >
          <t-option v-for="item in iconOptions" :key="item.stem" :value="item.stem" class="inline-block text-20px!">
            <div>
              <t-icon :name="item.stem" />
            </div>
          </t-option>
          <template #valueDisplay><t-icon :name="formData.icon" :style="{ marginRight: '8px' }" />{{ formData.icon }}</template>
        </t-select>
      </t-form-item>
      <t-form-item
        :label="$t('pages.module.code')"
        name="code"
        :rules="$rules.inputRules('pages.module.code')"
      >
        <t-input
          v-model="formData.code"
          clearable
          :maxlength="40"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.module.code') })"
          @enter="handleConfirm"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.module.url')"
        name="url"
        :rules="$rules.inputRules('pages.module.url')"
      >
        <t-input
          v-model="formData.url"
          clearable
          :maxlength="100"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.module.url') })"
          @enter="handleConfirm"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.module.component')"
        name="component"
        :rules="$rules.inputRules('pages.module.component')"
      >
        <t-input
          v-model="formData.component"
          clearable
          :maxlength="100"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.module.component') })"
          @enter="handleConfirm"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.module.target')"
        name="target"
      >
        <t-select
          clearable
          creatable
          filterable
          v-model="formData.target"
          :placeholder="$t('pages.form.selectPlaceholder', { field: $t('pages.module.target') })"
        >
          <t-option
            v-for="value in ModuleTargets"
            :key="value"
            :label="value"
            :value="value"
          />
        </t-select>
      </t-form-item>
      <t-form-item
        :label="$t('pages.module.sequence')"
        name="sequence"
        :rules="$rules.inputNumberRules('pages.module.sequence', false)"
      >
        <t-input-number
          v-model="formData.sequence"
          clearable
          auto-width
          theme="column"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.module.sequence') })"
          @enter="handleConfirm"
        >
        </t-input-number>
      </t-form-item>
      <t-form-item
        :label="$t('pages.module.enabled')"
        name="enabled"
      >
        <t-switch
          v-model="formData.enabled"
          :label="[$t('pages.common.status.enabled'), $t('pages.common.status.disabled')]"
        />
      </t-form-item>
      <t-form-item
        :label="$t('pages.module.meta')"
        name="description"
        :rules="$rules.inputRules('pages.module.meta', false)"
      >
        <t-textarea
          v-model="formData.meta"
          clearable
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.module.meta') })"
        />
      </t-form-item>
      <t-form-item
        :label="$t('pages.module.description')"
        name="description"
        :rules="$rules.inputRules('pages.module.description', false)"
      >
        <t-textarea
          v-model="formData.description"
          clearable
          :maxlength="150"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.module.description') })"
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
