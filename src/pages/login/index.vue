<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="title-container">
        <h1 class="title margin-no">{{ title }}</h1>
      </div>
      <login />
	    <tdesign-setting />
    </div>
    <footer class="copyright">Copyright @ 2023 MichaelSun. All Rights Reserved</footer>
  </div>
</template>
<script lang="ts">
export default {
  name: 'LoginIndex',
};
</script>
<script setup lang="ts">
import Login from './components/Login.vue';

import TdesignSetting from '@/layouts/setting.vue';

// @ts-ignore
const title = __TITLE__;
</script>

<style lang="less" scoped>
@import './index.less';
</style>
