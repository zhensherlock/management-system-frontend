import { App } from 'vue';

import result from './result/index.vue';
import filterCard from './filter-card/index.vue';
import organizationName from './organization-name/index.vue';
import roleName from './role-name/index.vue';

export const registerGlobalComponents = (app: App<Element>) => {
  app.component('Result', result);
  app.component('FilterCard', filterCard);
  app.component('OrganizationName', organizationName);
  app.component('RoleName', roleName);
};
