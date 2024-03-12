<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="title-container">
        <h1 class="title margin-no">{{ title }}</h1>
      </div>
      <login ref="loginRef" />
	    <tdesign-setting />
    </div>
    <t-sticky-tool :offset="[-60, -10]">
      <t-sticky-item label="模拟登录" v-if="$app.isDev">
        <template #icon><user-circle-icon /></template>
        <template #popup>
          <t-space direction="vertical" size="small">
            <t-button @click="handleSimulateLogin('education')">教育局用户</t-button>
            <t-button @click="handleSimulateLogin('school')">学校用户</t-button>
            <t-button @click="handleSimulateLogin('security')">保安用户</t-button>
          </t-space>
        </template>
      </t-sticky-item>
    </t-sticky-tool>
    <footer class="copyright">Copyright @ 2024 MichaelSun. All Rights Reserved</footer>
  </div>
</template>
<script lang="ts">
export default {
  name: 'LoginIndex',
};
</script>
<script setup lang="ts">
import { ref } from 'vue';
import { UserCircleIcon } from 'tdesign-icons-vue-next';
import Login from './components/Login.vue';
import TdesignSetting from '@/layouts/setting.vue';

const loginRef = ref<InstanceType<typeof Login>>();

// @ts-ignore
const title = __TITLE__;

const handleSimulateLogin = (type: string) => {
  loginRef.value.handleSimulateLogin(type);
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
