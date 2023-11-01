<template>
  <t-form
    ref="form"
    :class="['item-container', `login-${type}`]"
    :data="formData"
    label-width="0"
    @submit="onSubmit"
  >
    <t-form-item name="account" :rules="[{ required: true, message: $t('login.form.userName.errMsg'), type: 'error' }]">
      <t-input v-model="formData.account" size="large" placeholder="请输入账号">
        <template #prefix-icon>
          <t-icon name="user" />
        </template>
      </t-input>
    </t-form-item>

    <t-form-item
      name="password"
      :rules="[{ required: true, message: $t('login.form.userName.errMsg'), type: 'error' }]"
    >
      <t-input
        v-model="formData.password"
        size="large"
        :type="showPsw ? 'text' : 'password'"
        clearable
        placeholder="请输入登录密码"
      >
        <template #prefix-icon>
          <t-icon name="lock-on" />
        </template>
        <template #suffix-icon>
          <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
        </template>
      </t-input>
    </t-form-item>

    <t-form-item
      v-if="showCaptcha"
      class="captcha-form-item"
      name="captcha"
      :rules="[{ required: false, message: $t('login.form.userName.errMsg'), type: 'error' }]"
    >
      <t-input v-model="formData.captcha" size="large" placeholder="请输入验证码">
        <template #prefix-icon>
          <t-icon name="secured" />
        </template>
      </t-input>
      <t-image v-if="userStore.captchaInfo" :src="userStore.captchaInfo.imageBase64" @click="fetchCaptcha" />
    </t-form-item>
    <div class="check-container remember-pwd">
      <t-checkbox v-model="formData.checked">记住账号</t-checkbox>
    </div>
    <t-form-item class="btn-container">
      <t-button block size="large" type="submit">登 录</t-button>
    </t-form-item>
  </t-form>
</template>

<script setup lang="ts">
import type { FormInstanceFunctions, SubmitContext } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useUserStore } from '@/store';

const userStore = useUserStore();

const INITIAL_DATA = {
  account: 'blxx-user31',
  password: '1qaz!QAZ',
  captchaId: '',
  captcha: '',
  checked: false,
};

const type = ref('password');

const form = ref<FormInstanceFunctions>();
const formData = ref({ ...INITIAL_DATA });
const showPsw = ref(false);
const showCaptcha = ref(false);

const router = useRouter();
const route = useRoute();

const fetchCaptcha = () => {
  userStore.getCaptcha();
}

onMounted(() => {
  fetchCaptcha();
})

const onSubmit = async (ctx: SubmitContext) => {
  if (!ctx.validateResult) {
    return;
  }

  try {
    await userStore.login(formData.value);

    MessagePlugin.success('登陆成功');
    const redirect = route.query.redirect as string;
    const redirectUrl = redirect ? decodeURIComponent(redirect) : '/dashboard';
    router.push(redirectUrl);
  } catch (e) {
    MessagePlugin.error(e.message);
  }
};
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
