<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useUserStore } from '@/store';
import * as profileApi from '@/api/profile';
import { FormInstanceFunctions, MessagePlugin, SubmitContext } from 'tdesign-vue-next';
import { t } from '@/locales';

const status = ref('view');
const user = useUserStore();

const form = ref<FormInstanceFunctions>();

const formData = reactive({
  name: '',
  realName: '',
  email: '',
  tel: '',
});

const handleToggleEdit = () => {
  status.value = 'edit';
  Object.assign(formData, {
    name: user.userInfo.name,
    realName: user.userInfo.realName,
    email: user.userInfo.email,
    tel: user.userInfo.tel,
  });
};

const handleSave = () => {
  form.value.submit();
}

const handleSubmit = ({ validateResult }: SubmitContext) => {
  if (validateResult !== true) {
    return;
  }
  profileApi.updateProfile({
    name: formData.name,
    realName: formData.realName,
    email: formData.email,
    tel: formData.tel,
  }).then((data: any) => {
    user.setUserInfo(data);
    status.value = 'view';
    MessagePlugin.success(t('pages.message.update'));
  });
}

const handleCancel = () => {
  form.value.clearValidate();
  status.value = 'view';
}
</script>

<template>
  <div class="flex flex-col min-h-100%">
    <t-card :title="$t('pages.profile.basic.title')" header-bordered :bordered="false" class="flex-1">
      <template #actions>
        <template v-if="status === 'view'">
          <t-button size="small" variant="text" theme="primary" class="icon-operation" @click="handleToggleEdit">
            <template #icon><span class="t-icon i-material-symbols-edit-square"></span></template>
            {{ $t('pages.record.operation.update') }}
          </t-button>
        </template>
        <template v-if="status === 'edit'">
          <t-button size="small" variant="text" theme="primary" class="icon-operation" @click="handleSave">
            <template #icon><span class="t-icon i-mdi-content-save"></span></template>
            {{ $t('pages.record.operation.save') }}
          </t-button>
          <t-button size="small" variant="text" theme="primary" class="icon-operation" @click="handleCancel">
            <template #icon><span class="t-icon i-mdi-content-save-off"></span></template>
            {{ $t('pages.record.operation.cancel') }}
          </t-button>
        </template>
      </template>
      <t-form
        class="w-50% mt-20px"
        labelWidth="90px"
        ref="form"
        :data="formData"
        @submit="handleSubmit"
      >
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
            { whitespace: true, message: $t('pages.form.whitespaceText', { field: $t('pages.user.name') }), type: 'error', trigger: 'change'},
          ]"
        >
          <template v-if="status === 'view'">
            {{ user.userInfo.name }}
          </template>
          <template v-else>
            <t-input
              autofocus
              v-model="formData.name"
              :maxlength="100"
              :placeholder="$t('pages.form.placeholder', { field: $t('pages.user.name') })"
              @enter="handleSave"
            />
          </template>
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
            { whitespace: true, message: $t('pages.form.whitespaceText', { field: $t('pages.user.realName') }), type: 'error', trigger: 'change'},
          ]"
        >
          <template v-if="status === 'view'">
            {{ user.userInfo.realName }}
          </template>
          <template v-else>
            <t-input
              v-model="formData.realName"
              :maxlength="100"
              :placeholder="$t('pages.form.placeholder', { field: $t('pages.user.realName') })"
              @enter="handleSave"
            />
          </template>
        </t-form-item>
        <t-form-item
          :label="$t('pages.user.email')"
          name="email"
          :rules="[
            { email: true, message: $t('pages.form.errorText', { field: $t('pages.user.email') }), type: 'error', trigger: 'change' },
          ]"
        >
          <template v-if="status === 'view'">
            {{ user.userInfo.email }}
          </template>
          <template v-else>
            <t-input
              v-model="formData.email"
              :maxlength="100"
              :placeholder="$t('pages.form.placeholder', { field: $t('pages.user.email') })"
              @enter="handleSave"
            />
          </template>
        </t-form-item>
        <t-form-item
          :label="$t('pages.user.tel')"
          name="tel"
          :rules="[
            { telnumber: true, message: $t('pages.form.errorText', { field: $t('pages.user.tel') }), type: 'error', trigger: 'change' },
          ]"
        >
          <template v-if="status === 'view'">
            {{ user.userInfo.tel }}
          </template>
          <template v-else>
            <t-input
              v-model="formData.tel"
              :maxlength="100"
              :placeholder="$t('pages.form.placeholder', { field: $t('pages.user.tel') })"
              @enter="handleSave"
            />
          </template>
        </t-form-item>
        <t-form-item :label="$t('pages.user.organization')">
          <t-space>
            <t-tag v-for="(item) in user.userInfo.organizations" theme="primary" :key="item.id">
              {{ item.name }}
            </t-tag>
          </t-space>
        </t-form-item>
        <t-form-item :label="$t('pages.user.role')">
          <t-space>
            <t-tag v-for="(item) in user.userInfo.roles" theme="success" :key="item.id">
              {{ item.name }}
            </t-tag>
          </t-space>
        </t-form-item>
      </t-form>
    </t-card>
  </div>
</template>

<style scoped lang="less">
</style>
