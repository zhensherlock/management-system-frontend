<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="title-container">
        <h1 class="title margin-no">管理员登录</h1>
      </div>
      <t-form
        ref="form"
        class="item-container"
        :data="formData"
        label-width="0"
        @submit="handleSubmit"
      >
        <t-form-item
          name="account"
          :rules="[
            { required: true, message: $t('pages.form.requiredText', { field: $t('pages.login.account') }), type: 'error', trigger: 'change' },
            { whitespace: true, message: $t('pages.form.whitespaceText', { field: $t('pages.login.account') }), type: 'error', trigger: 'change' },
          ]"
        >
          <t-input
            v-model="formData.account"
            size="large"
            :placeholder="$t('pages.form.placeholder', { field: $t('pages.login.account') })"
          >
            <template #prefix-icon>
              <t-icon name="user" />
            </template>
          </t-input>
        </t-form-item>

        <t-form-item
          name="password"
          :rules="[
            { required: true, message: $t('pages.form.requiredText', { field: $t('pages.login.password') }), type: 'error', trigger: 'change' },
            { whitespace: true, message: $t('pages.form.whitespaceText', { field: $t('pages.login.password') }), type: 'error', trigger: 'change' },
          ]"
        >
          <t-input
            v-model="formData.password"
            size="large"
            :type="showPsw ? 'text' : 'password'"
            clearable
            :placeholder="$t('pages.form.placeholder', { field: $t('pages.login.password') })"
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
          v-if="userStore.showCaptcha"
          class="captcha-form-item"
          name="captcha"
          :rules="[
            { required: userStore.showCaptcha, message: $t('pages.form.requiredText', { field: $t('pages.login.captcha') }), type: 'error', trigger: 'change' },
            { whitespace: true, message: $t('pages.form.whitespaceText', { field: $t('pages.login.captcha') }), type: 'error', trigger: 'change' },
          ]"
        >
          <t-input
            v-model="formData.captcha"
            size="large"
            :placeholder="$t('pages.form.placeholder', { field: $t('pages.login.captcha') })"
            ref="captchaInput"
          >
            <template #prefix-icon>
              <t-icon name="secured" />
            </template>
          </t-input>
          <t-image v-if="userStore.captchaInfo" :src="userStore.captchaInfo.imageBase64" @click="fetchCaptcha" />
        </t-form-item>

        <t-form-item class="btn-container">
          <t-button block size="large" type="submit" :loading="loading"> {{ $t('pages.login.signIn') }} </t-button>
        </t-form-item>
      </t-form>
	    <setting />
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'AdminLogin',
};
</script>
<script setup lang="ts">
import type { FormInstanceFunctions, SubmitContext } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { ref, watchEffect, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import setting from '@/layouts/setting.vue';
import { useUserStore } from '@/store';
import type { LoginData } from "@/types/api/passport";

const userStore = useUserStore();

const form = ref<FormInstanceFunctions>();
const formData = ref({
  account: 'admin',
  password: '1qaz!QAZ',
  captcha: '',
  captchaId: '',
  checked: false,
});
const showPsw = ref(false);
const loading = ref(false);
const captchaInput = ref();

const router = useRouter();

const fetchCaptcha = () => {
  userStore.getAdminCaptcha();
}

watchEffect(() => {
  if (userStore.showCaptcha) {
    fetchCaptcha();
  }
})

const handleSubmit = async ({ validateResult }: SubmitContext) => {
  if (validateResult !== true) {
    return
  }
  loading.value = true
  try {
    if (userStore.captchaInfo?.id) {
      formData.value.captchaId = userStore.captchaInfo?.id
    }
    await userStore.adminLogin(formData.value as LoginData);

    MessagePlugin.success('登录成功');
    router.push('/dashboard');
    userStore.showCaptcha = false;
  } catch ({ cause }) {
    if (cause?.code === 'HY_10004') {
      userStore.showCaptcha = true;
      nextTick(() => {
        captchaInput.value.focus();
      });
    }
  }
  loading.value = false
};
</script>

<style lang="less" scoped>
.login-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-size: 95%;
  background-position: center;
  position: relative;
  background-color: #73ccf5;
  background-image: url('@/assets/bg.png');
  background-repeat: no-repeat;
}

.login-container {
  position: absolute;
  top: 22%;
  right: calc(50% - (200px + var(--td-comp-size-s)));
  background: #fff;
  padding: var(--td-comp-margin-xxxxl) var(--td-comp-size-s);
  border-radius: 4px;
}

.title-container {
  .title {
    font: var(--td-font-headline-large);
    color: var(--td-text-color-primary);
    margin-top: var(--td-comp-margin-xs);
    text-align: center;

    &.margin-no {
      margin-top: 0;
    }
  }
}

.item-container {
  width: 400px;
  margin-top: var(--td-comp-margin-xxxxl);

  .captcha-form-item {
    display: flex;
    align-items: center;

    .t-image__wrapper {
      margin-left: var(--td-comp-margin-l);
      border-radius: var(--td-radius-default);
      cursor: pointer;
    }

    :deep(.t-form__controls) {
      width: 100%;

      img {
        width: 120px;
        height: 40px;
        display: block;
      }
    }
  }
}

.copyright {
  font: var(--td-font-body-medium);
  color: var(--td-text-color-secondary);
  position: absolute;
  left: 0;
  right: 0;
  bottom: 20px;
  text-align: center;
}
</style>
