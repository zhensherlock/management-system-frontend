import { App } from 'vue';
import formRules from './form-rules';
import appRules from './app';

export function globalProperties(app: App): void {
  app.use(formRules);
  app.use(appRules);
}
