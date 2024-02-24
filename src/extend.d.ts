import { ComponentCustomProperties } from '@vue/runtime-core';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $rules: any;
    $app: any;
  }
}
export default ComponentCustomProperties;
