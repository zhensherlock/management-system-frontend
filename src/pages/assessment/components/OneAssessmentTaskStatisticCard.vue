<template>
  <div class="one-assessment-task-statistic-card">
    <t-card
      header-bordered
      :bordered="false"
      :loading="card.loading"
      v-if="props.currentAssessmentTask"
    >
      <template #title>
        <t-popup placement="right-top" overlayClassName="t-select__dropdown" :visible="card.triggerPopupVisible">
          <div class="flex items-center">
            <span class="inline-block mr-5px">{{ props.currentAssessmentTask.title }} - 统计分析</span>
            <SwapIcon ref="triggerIcon" class="cursor-pointer" @click="card.triggerPopupVisible = !card.triggerPopupVisible" />
          </div>
          <template #content>
            <div ref="triggerPopup" class="t-select__dropdown-inner t-select__dropdown-inner--size-m max-w-300px">
              <ul>
                <li
                  v-for="item in props.assessmentTaskList"
                  :key="item.group"
                  class="t-select-option-group t-size-m t-select-option-group__divider"
                >
                  <div class="t-select-option-group__header">{{ item.group }}</div>
                  <ul>
                    <li
                      class="t-select-option t-size-m"
                      v-for="subItem in item.children"
                      :key="subItem.id"
                      :title="subItem.title"
                      :class="[{
                      't-is-selected': subItem.id === props.currentAssessmentTask.id
                    }]"
                      @click="handleChangeCurrentAssessment(subItem)"
                    >
                      <span>{{ subItem.title }}</span>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </template>
        </t-popup>
      </template>
      <template #actions>
        <t-button size="small" variant="text" theme="primary" class="icon-operation" @click="handleShowAssessmentTaskDetail">
          <template #icon><span class="t-icon i-material-symbols-list-alt"></span></template>
          {{ $t('pages.assessment_task.statistic.header.detailButton') }}
        </t-button>
      </template>
      <t-space class="w-100% text-center" align="center">
        <t-statistic
          :title="$t('pages.assessment_task.statistic.header.total')"
          :unit="$t('pages.assessment_task.statistic.header.schoolUnit')"
          :value="card.statistics.total"
          color="black"
          :animation="card.statistics.animation.params"
          :animation-start="card.statistics.animation.start"
        />
        <t-statistic
          :title="$t('pages.assessment_task.statistic.header.submitted')"
          :unit="$t('pages.assessment_task.statistic.header.schoolUnit')"
          :value="card.statistics.submitted"
          color="blue"
          :animation="card.statistics.animation.params"
          :animation-start="card.statistics.animation.start"
        />
        <t-statistic
          :title="$t('pages.assessment_task.statistic.header.pending')"
          :unit="$t('pages.assessment_task.statistic.header.schoolUnit')"
          :value="card.statistics.pending"
          color="orange"
          :animation="card.statistics.animation.params"
          :animation-start="card.statistics.animation.start"
        />
        <t-statistic
          :title="$t('pages.assessment_task.statistic.header.returned')"
          :unit="$t('pages.assessment_task.statistic.header.schoolUnit')"
          :value="card.statistics.returned"
          color="red"
          :animation="card.statistics.animation.params"
          :animation-start="card.statistics.animation.start"
        />
        <t-statistic
          :title="$t('pages.assessment_task.statistic.header.donePercentage')"
          :decimal-places="2"
          :value="card.statistics.donePercentage"
          unit="%"
          color="green"
          :animation="card.statistics.animation.params"
          :animation-start="card.statistics.animation.start"
        />
        <template #separator>
          <t-divider class="h-66px" layout="vertical" />
        </template>
      </t-space>
      <template #footer>
        <t-progress status="success" class="progress" :percentage="card.statistics.donePercentage" :label="false" />
      </template>
      <AssessmentTaskDetailListDrawer
        v-if="props.currentAssessmentTask"
        v-model="assessmentTaskDetailListDrawer.visible"
        :mdl="props.currentAssessmentTask"
      />
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { SwapIcon } from 'tdesign-icons-vue-next';
import { PropType, reactive, ref, watch } from 'vue';
import { onClickOutside } from '@vueuse/core'
import { getAssessmentTaskStatistic } from '@/api/statistic.api';
import { AssessmentTaskDetailListDrawer } from '@/pages/assessment/components/index';

const props = defineProps({
  currentAssessmentTask: {
    type: Object,
    default: null,
  },
  assessmentTaskList: {
    type: Array as PropType<any[]>,
    default: () => ([]),
  },
});

const emits = defineEmits(['update:currentAssessmentTask']);

watch(() => props.currentAssessmentTask, () => {
  if (props.currentAssessmentTask) {
    handleGetCurrentAssessmentTaskStatistic();
  }
});

const triggerIcon = ref(null);
const triggerPopup = ref(null);
onClickOutside(triggerPopup, () => {
  card.triggerPopupVisible = false;
}, {
  ignore: [triggerIcon],
});

const card = reactive({
  triggerPopupVisible: false,
  loading: false,
  statistics: {
    total: 0,
    submitted: 0,
    pending: 0,
    returned: 0,
    done: 0,
    donePercentage: 0,
    animation: {
      start: true,
      params: {
        valueFrom: 0,
        duration: 200,
      },
    },
  },
});

const assessmentTaskDetailListDrawer = reactive({
  visible: false,
});

const handleShowAssessmentTaskDetail = () => {
  assessmentTaskDetailListDrawer.visible = true;
};

const handleChangeCurrentAssessment = (item: any) => {
  emits('update:currentAssessmentTask', item);
  card.triggerPopupVisible = false;
};

const handleGetCurrentAssessmentTaskStatistic = () => {
  card.loading = true;
  card.statistics.total = 0;
  card.statistics.submitted = 0;
  card.statistics.pending = 0;
  card.statistics.returned = 0;
  card.statistics.done = 0;
  card.statistics.donePercentage = 0;
  getAssessmentTaskStatistic(props.currentAssessmentTask.id).then((res: any) => {
    card.statistics.total = res.total;
    card.statistics.submitted = res.submitted;
    card.statistics.pending = res.pending;
    card.statistics.returned = res.returned;
    card.statistics.done = res.done;
    card.statistics.donePercentage = res.donePercentage;
    card.loading = false;
  });
};
</script>

<style scoped lang="less">
.one-assessment-task-statistic-card {
  :deep(.t-card) {
    --td-component-border: #E4EEF6;

    .t-card__footer {
      padding: 0;

      .t-progress__info {
        display: none;
      }
    }
  }
}

.progress {
  :deep(.t-progress__bar) {
    border-radius: 0 0 var(--td-radius-medium) var(--td-radius-medium);

    .t-progress__inner {
      border-radius: 0 0 0 var(--td-radius-medium);
    }
  }
}
</style>
