<template>
  <div class="login-wrapper">
<!--    <login-header />-->

    <div class="login-container">
      <div class="title-container">
        <h1 class="title margin-no">{{ sss }}</h1>
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
import { ref } from 'vue';

import TdesignSetting from '@/layouts/setting.vue';

import LoginHeader from './components/Header.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';

const type = ref('login');

const sss = __TITLE__;
const switchType = (val: string) => {
  type.value = val;
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
