<template>
  <t-form
    ref="form"
    :class="['item-container']"
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

	  <div class="check-container remember-pwd">
		  <t-checkbox>{{ $t('pages.login.remember') }}</t-checkbox>
	  </div>

    <t-form-item class="btn-container">
      <t-button block size="large" type="submit" :loading="loading"> {{ $t('pages.login.signIn') }} </t-button>
    </t-form-item>
  </t-form>
</template>

<script setup lang="ts">
import type { FormInstanceFunctions, SubmitContext } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { ref, onMounted, watchEffect, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useUserStore } from '@/store';
import type { LoginData } from "@/types/api/passport";

const userStore = useUserStore();

const form = ref<FormInstanceFunctions>();
const formData = ref({
	account: 'jyj-user',
	password: '1qaz!QAZ',
  captcha: '',
  captchaId: '',
	checked: false,
});
const showPsw = ref(false);
const loading = ref(false);
const captchaInput = ref();

const router = useRouter();
const route = useRoute();

const fetchCaptcha = () => {
  userStore.getCaptcha();
}

watchEffect(() => {
  if (userStore.showCaptcha) {
    fetchCaptcha();
  }
})
onMounted(() => {
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
		await userStore.login(formData.value as LoginData);

		MessagePlugin.success('登录成功');
		const redirect = route.query.redirect as string;
		const redirectUrl = redirect ? decodeURIComponent(redirect) : '/dashboard';
		router.push(redirectUrl);
    userStore.showCaptcha = false;
	} catch ({ cause }) {
    if (cause.code === 'HY_10004') {
      userStore.showCaptcha = true;
      nextTick(() => {
        captchaInput.value.focus();
      })
    }
		MessagePlugin.error(cause.message);
	}
	loading.value = false
};
</script>

<style lang="less" scoped>
@import '../index.less';
</style>
