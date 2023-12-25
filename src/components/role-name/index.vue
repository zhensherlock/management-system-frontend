<script lang="ts">
export default {
  name: 'RoleName',
};
</script>
<script setup lang="ts">
import { isArray } from 'lodash';
const props = defineProps({
  mdl: {
    type: [Object, Array],
    default: () => ([]),
  },
});
</script>

<template>
  <div class="role-name">
    <template v-if="isArray(props.mdl)">
      <span v-for="(item, index) in props.mdl" :key="index">
        {{ item.role.name }}
      </span>
    </template>
    <template v-else>
      {{ props.mdl.role.name }}
    </template>
  </div>
</template>

<style scoped lang="less">
.role-name:empty {
  &:before {
    content: '-';
  }
}
</style>
