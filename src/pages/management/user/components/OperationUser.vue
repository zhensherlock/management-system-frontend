<script setup lang="ts">
import type { FormInstanceFunctions, SubmitContext } from 'tdesign-vue-next';
import { ref, watch } from 'vue';
import { useCloned } from '@vueuse/core';
import _ from 'lodash';
import { createUser, updateUser } from '@/api/user';
import { MessagePlugin } from 'tdesign-vue-next';
import { t } from '@/locales';

const props = defineProps({
  modelValue: Boolean,
  isEdit: Boolean,
  organizationList: {
    type: Array,
    default: () => [],
  },
  roleList: {
    type: Array,
    default: () => [],
  },
  mdl: {
    type: Object,
    default() {
      return {
        name: '',
        password: '',
        realName: '',
        email: '',
        tel: '',
        organizationIds: [],
        roleIds: '',
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
    if (!_.isEmpty(formData.value.organizationUserMappings)) {
      formData.value.organizationIds = formData.value.organizationUserMappings.map(
        (item: any) => item.organizationId,
      )[0];
    }
    if (!_.isEmpty(formData.value.userRoleMappings)) {
      formData.value.roleIds = formData.value.userRoleMappings.map((item: any) => item.roleId)[0];
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
    new_password: formData.value.password,
    realName: formData.value.realName || '',
    email: formData.value.email || '',
    tel: formData.value.tel || '',
    organizationIds: [formData.value.organizationIds],
    roleIds: [formData.value.roleIds],
  };
  updateUser(formData.value.id, params).then(() => {
    // _.merge(props.mdl, params);
    emits('refresh-list');
    handleClose();
    MessagePlugin.success(t('pages.message.update'));
  });
};

const handleCreateSubmit = () => {
  const params = {
    name: formData.value.name,
    password: formData.value.password,
    realName: formData.value.realName || '',
    email: formData.value.email || '',
    tel: formData.value.tel || '',
    organizationIds: [formData.value.organizationIds],
    roleIds: [formData.value.roleIds],
  };
  createUser(params).then(() => {
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
      {{ isEdit ? $t('pages.user.update') : $t('pages.user.create') }}
    </template>
    <t-form ref="form" :data="formData" scroll-to-first-error="smooth" labelWidth="75px" @submit="handleSubmit">
      <t-form-item
        :label="$t('pages.user.name')"
        name="name"
        :rules="[
          {
            required: true,
            message: $t('pages.form.requiredText', { field: $t('pages.user.name') }),
            type: 'error',
            trigger: 'change',
          },
          {
            whitespace: true,
            message: $t('pages.form.whitespaceText', { field: $t('pages.user.name') }),
            type: 'error',
            trigger: 'change',
          },
        ]"
      >
        <t-input
          autofocus
          v-model="formData.name"
          clearable
          :maxlength="100"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.user.name') })"
          @enter="handleConfirm"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.user.password')"
        name="password"
        :rules="[
          {
            required: !isEdit,
            message: $t('pages.form.requiredText', { field: $t('pages.user.password') }),
            type: 'error',
            trigger: 'change',
          },
          {
            whitespace: true,
            message: $t('pages.form.whitespaceText', { field: $t('pages.user.password') }),
            type: 'error',
            trigger: 'change',
          },
          {
            pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/,
            message: $t('pages.form.passwordPatternText'),
            type: 'error',
            trigger: 'change',
          },
        ]"
      >
        <t-input
          v-model="formData.password"
          clearable
          :maxlength="40"
          type="password"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.user.password') })"
          @enter="handleConfirm"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.user.realName')"
        name="realName"
        :rules="[
          {
            required: true,
            message: $t('pages.form.requiredText', { field: $t('pages.user.realName') }),
            type: 'error',
            trigger: 'change',
          },
          {
            whitespace: true,
            message: $t('pages.form.whitespaceText', { field: $t('pages.user.realName') }),
            type: 'error',
            trigger: 'change',
          },
        ]"
      >
        <t-input
          v-model="formData.realName"
          clearable
          :maxlength="100"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.user.realName') })"
          @enter="handleConfirm"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.user.organization')"
        name="organizationIds"
        :rules="[
          {
            required: true,
            message: $t('pages.form.requiredText', { field: $t('pages.user.organization') }),
            type: 'error',
            trigger: 'change',
          },
        ]"
      >
        <t-cascader
          valueMode="parentFirst"
          :options="organizationList"
          :showAllLevels="true"
          :checkStrictly="true"
          :multiple="false"
          v-model="formData.organizationIds"
          clearable
          filterable
          :placeholder="$t('pages.form.selectPlaceholder', { field: $t('pages.user.organization') })"
        />
      </t-form-item>
      <t-form-item
        :label="$t('pages.user.role')"
        name="roleIds"
        :rules="[
          {
            required: true,
            message: $t('pages.form.requiredText', { field: $t('pages.user.role') }),
            type: 'error',
            trigger: 'change',
          },
        ]"
      >
        <t-select
          clearable
          filterable
          v-model="formData.roleIds"
          :options="roleList"
          :placeholder="$t('pages.form.selectPlaceholder', { field: $t('pages.user.role') })"
        />
      </t-form-item>
      <t-form-item
        :label="$t('pages.user.email')"
        name="email"
        :rules="[
          {
            email: true,
            message: $t('pages.form.errorText', { field: $t('pages.user.email') }),
            type: 'error',
            trigger: 'change',
          },
        ]"
      >
        <t-input
          v-model="formData.email"
          clearable
          :maxlength="100"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.user.email') })"
          @enter="handleConfirm"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.user.tel')"
        name="tel"
        :rules="[
          {
            telnumber: true,
            message: $t('pages.form.errorText', { field: $t('pages.user.tel') }),
            type: 'error',
            trigger: 'change',
          },
        ]"
      >
        <t-input
          v-model="formData.tel"
          clearable
          :maxlength="100"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.user.tel') })"
          @enter="handleConfirm"
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
