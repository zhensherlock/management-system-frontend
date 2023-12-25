<script lang="ts">
export default {
  name: 'OrganizationName',
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
// const emits = defineEmits([]);
</script>

<template>
  <div class="organization-name">
    <template v-if="isArray(props.mdl)">
      <span v-for="(item, index) in props.mdl" :key="index">
        {{ item.organization.name }}
      </span>
    </template>
    <template v-else>
      {{ props.mdl.organization.name }}
    </template>
  </div>
</template>

<style scoped lang="less">
.organization-name:empty {
  &:before {
    content: '-';
  }
}
</style>
