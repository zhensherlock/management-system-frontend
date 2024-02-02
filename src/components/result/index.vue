<template>
  <div class="result-container">
    <div class="result-bg-img">
      <component :is="dynamicComponent"></component>
    </div>
    <div class="result-title">{{ title }}</div>
    <div class="result-tip">
      <template v-if="$slots.tip">
        <slot name="tip"></slot>
      </template>
      <template v-else>
        {{ tip }}
      </template>
    </div>
    <slot />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

import Result403Icon from '@/assets/assets-result-403.svg?component';
import Result404Icon from '@/assets/assets-result-404.svg?component';
import Result500Icon from '@/assets/assets-result-500.svg?component';
import ResultEmptyIcon from '@/assets/assets-result-empty.svg?component';
import ResultIeIcon from '@/assets/assets-result-ie.svg?component';
import ResultMaintenanceIcon from '@/assets/assets-result-maintenance.svg?component';
import ResultWifiIcon from '@/assets/assets-result-wifi.svg?component';

const props = defineProps({
  bgUrl: String,
  title: String,
  tip: String,
  type: String,
});

const dynamicComponent = computed(() => {
  switch (props.type) {
    case '403':
      return Result403Icon;
    case '404':
      return Result404Icon;
    case '500':
      return Result500Icon;
    case 'empty':
      return ResultEmptyIcon;
    case 'ie':
      return ResultIeIcon;
    case 'wifi':
      return ResultWifiIcon;
    case 'maintenance':
      return ResultMaintenanceIcon;
    default:
      return Result403Icon;
  }
});
</script>
<style lang="less" scoped>
.result {
  &-link {
    color: var(--td-brand-color);
    text-decoration: none;
    cursor: pointer;

    &:hover {
      color: var(--td-brand-color);
    }

    &:active {
      color: var(--td-brand-color);
    }

    &--active {
      color: var(--td-brand-color);
    }

    &:focus {
      text-decoration: none;
    }
  }

  &-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: var(--td-comp-margin-s) 0;
    height: calc(100% - (var(--td-comp-margin-s) * 2));
  }

  &-bg-img {
    width: 200px;
    color: var(--td-brand-color);
    text-align: center;
  }

  &-title {
    font: var(--td-font-title-large);
    font-style: normal;
    margin-top: var(--td-comp-margin-l);
    color: var(--td-text-color-primary);
  }

  &-tip {
    margin: var(--td-comp-margin-s) 0 0;
    font: var(--td-font-body-medium);
    color: var(--td-text-color-secondary);
  }
}
</style>
