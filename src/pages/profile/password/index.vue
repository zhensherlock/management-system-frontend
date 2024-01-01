<script setup lang="ts">
import { reactive, ref } from 'vue';
import * as profileApi from '@/api/profile';
import { FormInstanceFunctions, MessagePlugin, SubmitContext } from 'tdesign-vue-next';
import { t } from '@/locales';

const form = ref<FormInstanceFunctions>();

const formData = reactive({
  old_password: '',
  new_password: '',
  repeat_new_password: '',
});

const handleSave = () => {
  form.value.submit();
}

const handleSubmit = ({ validateResult }: SubmitContext) => {
  if (validateResult !== true) {
    return;
  }
  profileApi.updatePassword({
    old_password: formData.old_password,
    new_password: formData.new_password,
    repeat_new_password: formData.repeat_new_password,
  }).then(_ => {
    MessagePlugin.success(t('pages.message.update'));
    form.value.reset();
  });
}

const validatorRePassword = (value: string) => {
  return value === formData.new_password;
}
</script>

<template>
  <div class="flex flex-col min-h-100%">
    <t-card :title="$t('pages.profile.password.title')" header-bordered :bordered="false" class="flex-1">
      <template #actions>
        <t-button size="small" variant="text" theme="primary" class="icon-operation" @click="handleSave">
          <template #icon><span class="t-icon i-mdi-content-save"></span></template>
          {{ $t('pages.record.operation.save') }}
        </t-button>
      </template>
      <t-form
        class="w-50% mt-20px"
        labelWidth="90px"
        ref="form"
        :data="formData"
        @submit="handleSubmit"
      >
        <t-form-item
          :label="$t('pages.user.old_password')"
          name="old_password"
          :rules="[
            { required: true, message: $t('pages.form.requiredText', { field: $t('pages.user.old_password') }), type: 'error', trigger: 'change' },
            { whitespace: true, message: $t('pages.form.whitespaceText', { field: $t('pages.user.old_password') }), type: 'error', trigger: 'change'},
          ]"
        >
          <t-input
            autofocus
            type="password"
            v-model="formData.old_password"
            :maxlength="100"
            :placeholder="$t('pages.form.placeholder', { field: $t('pages.user.old_password') })"
            @enter="handleSave"
          />
        </t-form-item>
        <t-form-item
          :label="$t('pages.user.new_password')"
          name="new_password"
          :rules="[
            { required: true, message: $t('pages.form.requiredText', { field: $t('pages.user.new_password') }), type: 'error', trigger: 'change' },
            { whitespace: true, message: $t('pages.form.whitespaceText', { field: $t('pages.user.new_password') }), type: 'error', trigger: 'change'},
            { pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/, message: $t('pages.form.passwordPatternText'), type: 'error', trigger: 'change' },
          ]"
        >
          <t-input
            type="password"
            v-model="formData.new_password"
            :maxlength="100"
            :placeholder="$t('pages.form.placeholder', { field: $t('pages.user.new_password') })"
            @enter="handleSave"
          />
        </t-form-item>
        <t-form-item
          :label="$t('pages.user.repeat_new_password')"
          name="repeat_new_password"
          :rules="[
            { required: true, message: $t('pages.form.requiredText', { field: $t('pages.user.repeat_new_password') }), type: 'error', trigger: 'change' },
            { whitespace: true, message: $t('pages.form.whitespaceText', { field: $t('pages.user.repeat_new_password') }), type: 'error', trigger: 'change'},
            { validator: validatorRePassword, message: $t('pages.form.surePasswordText'), type: 'error', trigger: 'change' }
          ]"
        >
          <t-input
            type="password"
            v-model="formData.repeat_new_password"
            :maxlength="100"
            :placeholder="$t('pages.form.placeholder', { field: $t('pages.user.repeat_new_password') })"
            @enter="handleSave"
          />
        </t-form-item>
      </t-form>
    </t-card>
  </div>
</template>

<style scoped lang="less">
</style>
