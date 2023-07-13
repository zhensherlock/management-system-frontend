import 'tdesign-vue-next/es/style/index.css';
import '@/style/index.less';
import './permission';

import TDesign from 'tdesign-vue-next';
import { createApp } from 'vue';

import App from './App.vue';
import i18n from './locales';
import router from './router';
import { store } from './store';

const app = createApp(App);

app.use(TDesign);
app.use(store);
app.use(router);
app.use(i18n);

app.mount('#app');
