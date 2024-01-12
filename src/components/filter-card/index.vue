<template>
  <t-card :title="title" header-bordered :bordered="false" class="filter-card">
    <template #title v-if="$slots.title">
      <slot name="title"></slot>
    </template>
    <template #actions>
      <slot name="actions"></slot>
    </template>
    <div class="filter-body">
      <div class="filter-body-label">{{ $t('pages.record.filter.label') }}</div>
      <div class="filter-body-content">
        <t-form ref="form" layout="inline" labelWidth="0px">
          <!--          <perfect-scrollbar>-->
          <t-form-item v-for="item in props.options" :name="item.name" :key="item.name">
            <t-select
              v-if="item.type === 'select'"
              auto-width
              clearable
              borderless
              filterable
              v-model="inputData[item.name]"
              :options="item.children"
              :placeholder="item.placeholder"
              @change="handleChangeItem(item)"
              v-bind="item.props"
            />
            <t-input
              v-else-if="item.type === 'input'"
              auto-width
              v-model="inputData[item.name]"
              :label="item.label"
              :placeholder="item.placeholder"
              @enter="handleChangeItem(item)"
              v-bind="item.props"
            >
              <template #suffixIcon>
                <search-icon :style="{ cursor: 'pointer' }" @click="handleChangeItem(item)" />
              </template>
            </t-input>
            <t-tree-select
              v-else-if="item.type === 'tree-select'"
              multiple
              borderless
              autoWidth
              clearable
              filterable
              :data="item.children"
              :placeholder="item.placeholder"
              v-bind="item.props"
            >
            </t-tree-select>
            <t-cascader
              v-else-if="item.type === 'cascader'"
              :options="item.children"
              :showAllLevels="true"
              v-model="inputData[item.name]"
              multiple
              borderless
              autoWidth
              clearable
              filterable
              :placeholder="item.placeholder"
              v-bind="item.props"
              @change="handleChangeItem(item)"
            />
          </t-form-item>
          <!--          </perfect-scrollbar>-->
        </t-form>
      </div>
      <div class="filter-body-reset" v-if="resetFilterVisible">
        <t-link theme="primary" hover="color" @click="handleResetFilter">
          <t-space :size="4">
            <swap-icon slot="prefix-icon"></swap-icon>
            重置筛选
          </t-space>
        </t-link>
      </div>
    </div>
  </t-card>
</template>
<script lang="ts">
export default {
  name: 'FilterCard',
};
</script>

<script setup lang="ts">
import { SearchIcon, SwapIcon } from 'tdesign-icons-vue-next';
import { PropType, reactive, watch, computed, nextTick } from 'vue';
import { isEmpty } from 'lodash';

export interface OptionsType {
  type: string;
  name: string;
  value: string | number;
  label: string;
  placeholder: string;
  children: any[];
  props: any;
}

const props = defineProps({
  modelValue: {
    type: Object,
  },
  title: {
    type: String,
  },
  options: {
    type: Array as PropType<OptionsType[]>,
    default: () => [],
  },
});

const emits = defineEmits(['update:modelValue', 'submit']);
const defaultInputData = {};
props.options.forEach((item: any) => {
  // @ts-ignore
  defaultInputData[item.name] = item.value;
});
// 组件受控数据
const inputData = reactive<{ [key: string]: any }>({...defaultInputData});
// 搜索确认数据
const searchData = reactive<{ [key: string]: any }>({...defaultInputData});

const resetFilterVisible = computed(() => {
  return Object.values(searchData).some((value) => {
    return !isEmpty(value);
  });
});

watch(props.modelValue, () => {
  Object.keys(props.modelValue).forEach((key) => {
    inputData[key] = props.modelValue[key];
    searchData[key] = props.modelValue[key];
  });
});

const handleResetFilter = () => {
  Object.keys(inputData).forEach((key) => {
    // @ts-ignore
    inputData[key] = defaultInputData[key];
  });
  syncSearchData();
  handleSubmit();
};

const syncSearchData = () => {
  Object.keys(inputData).forEach((key) => {
    searchData[key] = inputData[key];
  });
};

const handleChangeItem = (item: OptionsType) => {
  searchData[item.name] = inputData[item.name];
  handleSubmit();
};

const handleSubmit = () => {
  emits('update:modelValue', searchData);
  emits('submit', searchData);
};
</script>

<style scoped lang="less">
.t-form-inline {
  .t-form__item {
    margin-right: 0;
    min-width: auto;
  }
}
</style>
