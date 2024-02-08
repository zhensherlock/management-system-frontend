<template>
  <div
    class="app-scrollbar"
    :style="[
      {
        '--height': props.height,
        '--max-height': props.maxHeight,
      }
    ]"
  >
    <perfect-scrollbar :options="{ suppressScrollX: true }">
      <div class="ps__body">
        <slot></slot>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  height: {
    type: String,
  },
  maxHeight: {
    type: String,
  }
});
</script>

<style scoped lang="less">
.app-scrollbar {
  :deep(.ps) {
    overflow: auto !important;
    height: var(--height, 100%);
    max-height: var(--max-height, initial);
    //scrollbar-width: none;

    &::-webkit-scrollbar {
      background: transparent;
      width: 0;
    }

    .ps__rail-y {
      opacity: 0.6;
      right: -5px;
    }
  }

  .ps__body {
    overflow: hidden;
  }
}
</style>
