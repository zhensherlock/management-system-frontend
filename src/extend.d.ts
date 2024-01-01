import { ComponentCustomProperties } from '@vue/runtime-core';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $rules: any;
  }
}
export default ComponentCustomProperties;
