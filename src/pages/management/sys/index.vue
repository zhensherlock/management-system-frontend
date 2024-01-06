<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import * as systemConfigApi from '@/api/sys';
import { FormInstanceFunctions, MessagePlugin, SubmitContext } from 'tdesign-vue-next';
import { t } from '@/locales';

const form = ref<FormInstanceFunctions>();

const formData = reactive({
  name: '',
  description: '',
  options: '',
});

onMounted(() => {
  systemConfigApi.getSystemConfig().then((data: any) => {
    formData.name = data.name;
    formData.description = data.description;
    formData.options = JSON.stringify(data.options);
  });
});

const handleSave = () => {
  form.value.submit();
}

const handleSubmit = ({ validateResult }: SubmitContext) => {
  if (validateResult !== true) {
    return;
  }
  systemConfigApi.updateSystemConfig({
    name: formData.name,
    description: formData.description,
    options: JSON.parse(formData.options),
  }).then(_ => {
    MessagePlugin.success(t('pages.message.update'));
  });
}
</script>

<template>
  <div class="flex flex-col h-100%">
    <t-card :title="$t('pages.system.basic.title')" header-bordered :bordered="false" class="flex-1 flex flex-col">
      <template #actions>
        <t-button size="small" variant="text" theme="primary" class="icon-operation" @click="handleSave">
          <template #icon><span class="t-icon i-mdi-content-save"></span></template>
          {{ $t('pages.record.operation.save') }}
        </t-button>
      </template>
      <t-form
        class="w-500px mt-20px mx-auto my-0"
        labelWidth="120px"
        ref="form"
        :data="formData"
        @submit="handleSubmit"
      >
        <t-form-item
          :label="$t('pages.system.name')"
          name="name"
          :rules="[
            { required: true, message: $t('pages.form.requiredText', { field: $t('pages.system.name') }), type: 'error', trigger: 'change' },
            { whitespace: true, message: $t('pages.form.whitespaceText', { field: $t('pages.system.name') }), type: 'error', trigger: 'change'},
          ]"
        >
          <t-input
            autofocus
            v-model="formData.name"
            :maxlength="100"
            :placeholder="$t('pages.form.placeholder', { field: $t('pages.system.name') })"
            @enter="handleSave"
          />
        </t-form-item>
        <t-form-item
          :label="$t('pages.system.description')"
          name="description"
          :rules="$rules.inputRules('pages.module.description', false)"
        >
          <t-textarea
            v-model="formData.description"
            clearable
            :maxlength="150"
            :autosize="{ minRows: 4, maxRows: 6 }"
            :placeholder="$t('pages.form.placeholder', { field: $t('pages.system.description') })"
          />
        </t-form-item>
        <t-form-item
          :label="$t('pages.system.options')"
          name="options"
          :rules="$rules.inputRules('pages.module.options', false)"
        >
          <t-textarea
            v-model="formData.options"
            clearable
            :autosize="{ minRows: 4, maxRows: 6 }"
            :placeholder="$t('pages.form.placeholder', { field: $t('pages.system.options') })"
          />
        </t-form-item>
      </t-form>
    </t-card>
  </div>
</template>

<style scoped lang="less">
:deep(.t-card) {
  .t-card__body {
    flex: 1;
  }
}
</style>
