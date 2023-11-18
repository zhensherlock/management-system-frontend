import { App } from 'vue';

import result from './result/index.vue';

export const registerGlobalComponents = (app: App<Element>) => {
  app.component('Result', result);
};
