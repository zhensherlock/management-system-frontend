/* eslint-disable simple-import-sort/imports */
import TDesign from 'tdesign-vue-next';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import { store } from './store';
import i18n from './locales';
import { registerGlobalComponents } from '@/components/global';
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import { globalProperties } from '@/utils/properties';
import './permission';

import 'tdesign-vue-next/es/style/index.css';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import '@/style/index.less';
import 'virtual:uno.css'

const app = createApp(App);

app.use(TDesign);
app.use(store);
app.use(router);
app.use(i18n);
app.use(PerfectScrollbar);
app.use(globalProperties);
registerGlobalComponents(app);

app.mount('#app');
