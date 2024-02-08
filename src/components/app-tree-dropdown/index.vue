<template>
  <t-popup
    placement="bottom-right"
    overlayClassName="app-tree-dropdown-popup"
    :visible="popup.visible"
    :popperOptions="{ modifiers: [{ name: 'offset', options: { offset: [0, 0] } }]}"
  >
    <t-button
      ref="triggerButton"
      theme="default"
      variant="outline"
      :class="[{
        'active': popup.visible
      }]"
      @click="togglePopupVisible"
    >
      <template #suffix>
        <ChevronDownIcon class="trigger-icon" />
      </template>
      {{ title }}
    </t-button>
    <template #content>
      <div ref="triggerPopup">
        <div class="app-tree-dropdown-popup-body">
          <perfect-scrollbar class="max-h-300px">
            <t-tree
              :model-value="props.selectedData"
              :label="true"
              :checkable="true"
              :expandAll="true"
              :icon="true"
              :line="true"
              :transition="true"
              :hover="true"
              :activable="false"
              :active-multiple="false"
              :expand-on-click-node="true"
              :data="props.treeData"
              @change="handleChangeSelectedList"
            />
          </perfect-scrollbar>
        </div>
        <div class="lh-40px h-40px text-right px-8px py-0 app-tree-dropdown-popup-footer">
          <t-space :size="8">
            <t-link theme="default" hover="color" class="reset-button" @click="handleReset">
              <t-space :size="4">
                <span slot="prefix-icon" class="t-icon i-material-symbols-autorenew text-16px" rotate="60"></span>
                重置
              </t-space>
            </t-link>
<!--            <t-link theme="primary" hover="color">-->
<!--              确认-->
<!--            </t-link>-->
          </t-space>
        </div>
      </div>
    </template>
  </t-popup>
</template>
<script lang="ts">
export default {
  name: 'AppTreeDropdown',
};
</script>

<script setup lang="ts">
import { ChevronDownIcon } from 'tdesign-icons-vue-next';
import { type PropType, reactive, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  selectedData: {
    type: Array as PropType<any[]>,
    default: () => ([]),
  },
  treeData: {
    type: Array,
    default: () => ([]),
  },
});

const emits = defineEmits(['update:selectedData', 'change']);

const popup = reactive({
  visible: false,
});

const togglePopupVisible = () => {
  popup.visible = !popup.visible;
};

const triggerButton = ref(null);
const triggerPopup = ref(null);
onClickOutside(triggerPopup, () => {
  popup.visible = false;
}, {
  ignore: [triggerButton],
});

const handleChangeSelectedList = (value: any[]) => {
  emits('update:selectedData', value);
  emits('change', value);
};

const handleReset = () => {
  emits('update:selectedData', []);
  emits('change', []);
};
</script>

<style scoped lang="less">
.t-button {
  &.active {
    .trigger-icon {
      transform: rotate(180deg);
    }
  }
}

.trigger-icon {
  transition: transform .15s linear;
}

.ps {
  padding: var(--td-comp-paddingTB-xs) var(--td-comp-paddingLR-s);
}

.app-tree-dropdown-popup-body {
  padding: var(--td-comp-paddingTB-xxs) !important;
}

.app-tree-dropdown-popup-footer {
  border-top: 1px solid var(--td-component-stroke);
}

.reset-button {
  color: var(--td-gray-color-8);
}

:global(.app-tree-dropdown-popup .t-popup__content) {
  padding: 0 !important;
  margin-top: var(--td-comp-margin-xs) !important;
  border-radius: var(--td-radius-default);
}
</style>
