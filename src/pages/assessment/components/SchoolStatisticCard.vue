<template>
  <div class="school-statistic-card">
    <t-card
      header-bordered
      :bordered="false"
      :loading="card.loading"
    >
      <template #title>
        <t-popup placement="right-top" :visible="card.schoolPopupVisible">
          <div class="flex items-center">
            <span class="inline-block mr-5px">学校统计分析</span>
            <MapSettingIcon ref="triggerIcon" class="cursor-pointer" @click="card.schoolPopupVisible = !card.schoolPopupVisible" />
          </div>
          <template #content>
            <div ref="triggerPopup">
              <t-tree
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
                :data="schoolTreeList"
                @change="handleChangeSelectedSchoolList"
              />
            </div>
          </template>
        </t-popup>
      </template>
      <result
        type="empty"
        :title="$t('pages.record.empty.title')"
        :tip="$t('pages.record.empty.tip')"
      />
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { MapSettingIcon } from 'tdesign-icons-vue-next';
import { computed, reactive, ref, watch } from 'vue';
import { onClickOutside } from '@vueuse/core'
import { getSchoolStatistic } from '@/api/statistic.api';
import { recursiveMap } from '@/utils';

const props = defineProps({
  selectedSchoolIds: {
    type: Array,
    default: () => ([]),
  },
  schoolList: {
    type: Array,
    default: () => ([]),
  },
});

const emits = defineEmits(['update:selectedSchoolIds']);

const assessmentTaskDetails = ref([]);

const schoolTreeList = computed(() => {
  return recursiveMap(props.schoolList, (item: any) => ({
    value: item.id,
    label: item.name,
  }));
});

watch(() => props.selectedSchoolIds, () => {
  if (props.selectedSchoolIds.length) {
    handleGetSchoolListStatistic();
  }
});

const triggerIcon = ref(null);
const triggerPopup = ref(null);
onClickOutside(triggerPopup, () => {
  card.schoolPopupVisible = false;
}, {
  ignore: [triggerIcon],
});

const card = reactive({
  schoolPopupVisible: false,
  loading: false,
});

const handleChangeSelectedSchoolList = (value: any[]) => {
  emits('update:selectedSchoolIds', value);
  card.schoolPopupVisible = false;
};

const handleGetSchoolListStatistic = () => {
  card.loading = true;
  getSchoolStatistic({
    schoolIds: props.selectedSchoolIds
  }).then((res: any) => {
    assessmentTaskDetails.value = res;
    card.loading = false;
  });
};
</script>

<style scoped lang="less">
</style>
