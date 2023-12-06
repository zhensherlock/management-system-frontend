import { App } from 'vue';

import result from './result/index.vue';
import filterCard from './filter-card/index.vue';

export const registerGlobalComponents = (app: App<Element>) => {
  app.component('Result', result);
  app.component('FilterCard', filterCard);
};
