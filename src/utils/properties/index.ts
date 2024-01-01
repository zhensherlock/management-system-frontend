import { App } from 'vue';
import formRules from './form-rules';

export function globalProperties(app: App): void {
  app.use(formRules);
}
