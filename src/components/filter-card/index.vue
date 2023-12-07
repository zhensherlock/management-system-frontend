<template>
  <t-card :title="title" header-bordered :bordered="false" class="filter-card">
    <div class="filter-body">
      <div class="filter-body-label">{{ $t('pages.record.filter.label') }}</div>
      <div class="filter-body-content">
        <t-form ref="form" :data="inputData" layout="inline" labelWidth="0px" @submit="handleSearchSubmit">
          <t-form-item v-for="item in props.options" :name="item.name" :key="item.name">
            <t-select
	            auto-width
	            clearable
              borderless
              v-if="item.type === 'select'"
              v-model="inputData[item.name]"
              :options="item.children"
              :placeholder="item.placeholder"
              @change="handleChangeItem(item)"
              v-bind="item.props"
            />
            <t-input
              auto-width
              v-else-if="item.type === 'input'"
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
          </t-form-item>
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
    <template #actions>
      <slot name="actions"></slot>
    </template>
  </t-card>
</template>
<script lang="ts">
export default {
  name: 'FilterCard',
};
</script>

<script setup lang="ts">
import { SearchIcon, SwapIcon } from 'tdesign-icons-vue-next';
import type { PropType } from 'vue';
import { computed, onMounted, ref } from 'vue';
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

// 组件受控数据
const inputData = ref<{ [key: string]: any }>({});

// 搜索确认数据
const searchData = ref<{ [key: string]: any }>({});

const resetFilterVisible = computed(() => {
  return Object.values(searchData.value).some((value) => {
    return !isEmpty(value);
  });
});

onMounted(() => {
  props.options.forEach((item) => {
    inputData.value[item.name] = item.value;
  });
});

const handleSearchSubmit = () => {
  syncSearchData();
  handleSubmit();
};

const handleResetFilter = () => {
  Object.keys(inputData.value).forEach((key) => {
    inputData.value[key] = '';
  });
  syncSearchData();
  handleSubmit();
};

const syncSearchData = () => {
  Object.keys(inputData.value).forEach((key) => {
    searchData.value[key] = inputData.value[key];
  });
};

const handleChangeItem = (item: OptionsType) => {
  searchData.value[item.name] = inputData.value[item.name];
  handleSubmit();
};

const handleSubmit = () => {
  emits('update:modelValue', searchData.value);
  emits('submit', searchData.value);
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
