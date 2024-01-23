<script setup lang="ts">
import {computed, nextTick, ref} from 'vue';
import type { PrimaryTableCol } from 'tdesign-vue-next';
import { t } from '@/locales';
import _ from 'lodash';

const props = defineProps({
  assessment: {
    type: Object,
    default: () => ({}),
  },
  mode: {
    type: String,
    default: 'preview',
  }
});

const columns = ref<PrimaryTableCol[]>([
  { colKey: 'title', title: t('pages.assessment_task.contentTable.title'), width: '20%' },
  { colKey: 'desc', title: t('pages.assessment_task.contentTable.desc') },
  { colKey: 'score', title: t('pages.assessment_task.contentTable.score'), width: '8%', align: 'center' },
  { colKey: 'operation', title: t('pages.record.operation.label'), width: '8%', align: 'center' },
]);

const dataSource = computed(() => {
  const content: any = props.assessment.content;
  if (!_.isObject(content)) {
    return [];
  }
  const result: any[] = [];
  content.list.forEach((levelOneItem: any) => {
    result.push({
      id: levelOneItem.id,
      title: levelOneItem.title,
      level: 1,
      mergeParams: {
        colspan: 4,
      },
    });
    levelOneItem.children?.forEach((levelTwoItem: any) => {
      levelTwoItem.children?.forEach((levelThreeItem: any, levelTreeIndex: number) => {
        result.push({
          id: levelThreeItem.id,
          title: levelTwoItem.title,
          desc: levelThreeItem.title,
          needToScore: true,
          level: 3,
          ...(levelTreeIndex === 0 && {
            mergeParams: {
              rowspan: levelTwoItem.children?.length || 1,
              colspan: 1,
            },
          }),
        });
      })
    });
  })
  return result;
});

const summaryFootDataSource = computed(() => {
  return [{
    score: props.assessment.basicScore,
  }];
});

const rowspanAndColspan = ({ row, colIndex }: any) => {
  if (row.mergeParams && colIndex === 0) {
    return row.mergeParams;
  }
};

const headerAffixedTopProps = computed(() => {
  return {
    offsetTop: 16,
    container: '.task-detail-drawer .t-drawer__body',
  };
});

const footerAffixedBottomProps = computed(() => {
  return {
    offsetBottom: 16,
    container: '.task-detail-drawer .t-drawer__body',
  };
});

const handleShowEvaluation = (row: any) => {
  const index = expandedRowKeys.value.indexOf(row.id)
  if (index > -1) {
    expandedRowKeys.value.splice(index, 1);
  } else {
    expandedRowKeys.value.push(row.id);
  }

  nextTick(() => {})
};

const expandedRowKeys = ref([]);
const handleExpandChange = (value, params) => {
  expandedRowKeys.value = value;
  console.log('handleExpandChange', value, params);
};
</script>

<template>
  <div class="assessment-table" v-if="props.assessment.content">
<!--    <table class="t-descriptions__body t-size-s t-descriptions__body&#45;&#45;border w-100%">-->
<!--      <tr>-->
<!--        <td class="text-center w-24%">考核项目</td>-->
<!--        <td class="text-center">考核内容</td>-->
<!--        <td class="text-center w-8%">分数</td>-->
<!--        <td class="text-center w-8%">操作</td>-->
<!--      </tr>-->
<!--      <template v-for="levelOneItem in props.assessment.content.list" :key="levelOneItem.id">-->
<!--        <tr>-->
<!--          <td colspan="4">{{ levelOneItem.title }}</td>-->
<!--        </tr>-->
<!--        <template v-for="levelTwoItem in levelOneItem.children" :key="levelTwoItem.id">-->
<!--          <tr>-->
<!--            <td :rowspan="(levelTwoItem.children?.length || 1) + 1">{{ levelTwoItem.title }}</td>-->
<!--          </tr>-->
<!--          <tr v-for="levelThreeItem in levelTwoItem.children" :key="levelThreeItem.id">-->
<!--            <td>-->
<!--              {{ levelThreeItem.title }}-->
<!--            </td>-->
<!--            <td class="text-center">0</td>-->
<!--            <td class="text-center">操作</td>-->
<!--          </tr>-->
<!--        </template>-->
<!--      </template>-->
<!--    </table>-->
    <t-table
      bordered
      ref="tableElement"
      cell-empty-content="-"
      row-key="id"
      size="small"
      :data="dataSource"
      :columns="columns"
      :expand-on-row-click="true"
      :rowspan-and-colspan="rowspanAndColspan"
      :foot-data="summaryFootDataSource"
      :header-affixed-top="headerAffixedTopProps"
      :footer-affixed-bottom="footerAffixedBottomProps"
      :expanded-row-keys="expandedRowKeys"
      :expand-icon="false"
    >
      <template #expandedRow="{ row }">
        <div class="more-detail">
          <p class="title"><b>集群名称:</b></p>
        </div>
      </template>
      <template #operation="{ row }" v-if="props.mode === 'evaluation'">
        <t-space align="center" :size="0">
          <t-link hover="color" theme="primary" @click="handleShowEvaluation(row)">
            {{ $t('pages.assessment_task.contentTable.operation.evaluation') }}
          </t-link>
          <template #separator>
            <t-divider layout="vertical" />
          </template>
        </t-space>
      </template>
    </t-table>
  </div>
</template>

<style scoped lang="less">
:deep(.t-affix .t-table__affixed-footer-elm) {
  &:after {
    position: absolute;
    content: '';
    height: var(--td-comp-paddingTB-l);
    background: #fff;
    width: calc(100% + var(--td-comp-paddingTB-l));
    bottom: -16px;
    left: -16px;
  }
}

:deep(.t-table__affixed-footer-wrap) {
  td:first-child {
    border-left: none;
  }
}
</style>
