<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import type { PrimaryTableCol } from 'tdesign-vue-next';
import { t } from '@/locales';
import _ from 'lodash';
import { AssessmentScoreType } from '@/constants';
import { useCloned } from '@vueuse/core';

const props = defineProps({
  assessment: {
    type: Object,
    default: () => ({}),
  },
  scoreContent: {
    type: Object,
    default: () => ({
      totalScore: 0,
      grade: null,
      detail: {},
    }),
  },
  mode: {
    type: String,
    default: 'preview',
  },
  headerAffixedTopProps: {
    type: Object,
    default: () => ({
      offsetTop: 16,
      container: '.task-detail-drawer .t-drawer__body',
    }),
  },
  footerAffixedBottomProps: {
    type: Object,
    default: () => ({
      offsetBottom: 16,
      container: '.task-detail-drawer .t-drawer__body',
    }),
  },
});

const { cloned: editScoreContent } = useCloned(props.scoreContent);

const columns = ref<PrimaryTableCol[]>([
  { colKey: 'title', title: t('pages.assessmentTaskContentTable.table.title'), width: '20%' },
  { colKey: 'desc', title: t('pages.assessmentTaskContentTable.table.desc') },
  { colKey: 'score', title: t('pages.assessmentTaskContentTable.table.score'), width: '8%', align: 'center' },
  { colKey: 'operation', title: t('pages.record.operation.label'), width: '8%', align: 'center' },
]);

const dataSource = computed(() => {
  const content: { list: any[] } = props.assessment.content;
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
          needUpdateAttribute: levelTwoItem.children.length > 1,
          level: 3,
          parentId: levelThreeItem.parentId,
          maximumScore: levelThreeItem.maximumScore,
          scoreStep: levelThreeItem.scoreStep,
          scoreType: levelThreeItem.scoreType,
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
    // score: props.assessment.basicScore,
  }];
});

const rowspanAndColspan = ({ row, colIndex }: any) => {
  if (row.mergeParams && colIndex === 0) {
    return row.mergeParams;
  }
};

const handleShowEvaluation = (row: any) => {
  const index = expandedRowKeys.value.indexOf(row.id)
  if (index > -1) {
    expandedRowKeys.value.splice(index, 1);

    row.needUpdateAttribute && nextTick(() => {
      // 将二级标题的rowspan进行减一
      const levelTwoTitleDom = document.querySelector(`#level-two-${row.parentId}`);
      const levelTwoTitleTDDom = levelTwoTitleDom.closest('td');
      const levelTwoTitleTDRowspan = parseInt(levelTwoTitleTDDom.getAttribute('rowspan'));
      levelTwoTitleTDDom.setAttribute('rowspan', String(levelTwoTitleTDRowspan - 1));
    })
  } else {
    expandedRowKeys.value.push(row.id);

    row.needUpdateAttribute && nextTick(() => {
      // 将展开DOM所在td的colspan设置成3
      const evaluateDetailDom = document.querySelector(`#evaluate-detail-${row.id}`);
      // evaluateDetailDom.scrollIntoView({ block: 'nearest' });
      evaluateDetailDom.closest('td').setAttribute('colspan', '3');
      // 将二级标题的rowspan进行加一
      const levelTwoTitleDom = document.querySelector(`#level-two-${row.parentId}`);
      const levelTwoTitleTDDom = levelTwoTitleDom.closest('td');
      const levelTwoTitleTDRowspan = parseInt(levelTwoTitleTDDom.getAttribute('rowspan'));
      levelTwoTitleTDDom.setAttribute('rowspan', String(levelTwoTitleTDRowspan + 1));
    })
  }
};

const expandedRowKeys = ref([]);

const totalScore = computed(() => {
  return props.assessment.basicScore - totalSubtractScore.value + totalAddScore.value;
});

const totalSubtractScore = computed(() => {
  return Object.values(editScoreContent.value.detail).reduce((pre: number, cur: any) => {
    return pre + (cur.scoreType === AssessmentScoreType.Subtract ? cur.score : 0)
  }, 0) as number;
});

const totalAddScore = computed(() => {
  return Object.values(editScoreContent.value.detail).reduce((pre: number, cur: any) => {
    return pre + (cur.scoreType === AssessmentScoreType.Add ? cur.score : 0)
  }, 0) as number;
});

defineExpose({
  getNewScoreContent: () => {
    return editScoreContent.value;
  },
})
</script>

<template>
  <div class="assessment-table" v-if="props.assessment.content">
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
        <div class="evaluate-detail" :id="`evaluate-detail-${row.id}`" :data-level-two="row.parentId">
          <t-row :gutter="16">
            <t-col :flex="3">
              <t-input-number
                class="m-b-8px"
                size="small"
                placeholder=""
                v-model="editScoreContent.detail[row.id].score"
                :label="$t(`pages.assessmentTaskContentTable.scoreType.${row.scoreType === AssessmentScoreType.Add ? 'add' : 'subtract'}`)"
                :max="row.maximumScore"
                :step="row.scoreStep || 1"
                :min="0"
                :inputProps="{
                  autofocus: true,
                  readonly: true,
                }"
              />
              <t-textarea
                v-model="editScoreContent.detail[row.id].message"
                :placeholder="$t('pages.form.placeholder', { field: $t('pages.assessmentTaskContentTable.message') })"
                :autosize="{ minRows: 3, maxRows: 5 }"
              />
            </t-col>
            <t-col :flex="3">
<!--              <t-upload-->
<!--                multiple-->
<!--                placeholder="支持批量上传图片文件"-->
<!--                theme="image-flow"-->
<!--                :request-method="requestMethod1"-->
<!--                :auto-upload="autoUpload"-->
<!--                :show-image-file-name="showImageFileName"-->
<!--                :max="8"-->
<!--                :abridge-name="[6, 6]"-->
<!--                :upload-button="showUploadButton ? undefined : null"-->
<!--                :cancel-upload-button="showUploadButton ? { theme: 'default', content: '取消上传' } : null"-->
<!--              ></t-upload>-->
            </t-col>
          </t-row>
        </div>
      </template>
      <template #title="{ row }">
        <div :id="`level-two-${row.parentId}`" v-if="row.level === 3">{{ row.title }}</div>
        <template v-else>{{ row.title }}</template>
      </template>
      <template #score="{ row }">
        <template v-if="['evaluation', 'review'].includes(props.mode)">
          <template v-if="editScoreContent.detail[row.id].score > 0">
            <span class="t-link--theme-danger" v-if="row.scoreType === AssessmentScoreType.Add">
              {{ $t('pages.assessmentTaskContentTable.score.add', { score: editScoreContent.detail[row.id].score }) }}
            </span>
            <span class="t-link--theme-success" v-if="row.scoreType === AssessmentScoreType.Subtract">
              {{ $t('pages.assessmentTaskContentTable.score.subtract', { score: editScoreContent.detail[row.id].score }) }}
            </span>
          </template>
          <template v-else>
            {{ editScoreContent.detail[row.id].score }}
          </template>
        </template>
        <tempalte v-else-if="props.mode === 'preview'">-</tempalte>
      </template>
      <template #operation="{ row }" v-if="props.mode === 'evaluation'">
        <t-space align="center" :size="0">
          <t-link hover="color" theme="primary" @click="handleShowEvaluation(row)">
            {{ $t('pages.assessmentTaskContentTable.table.operation.evaluation') }}
          </t-link>
          <template #separator>
            <t-divider layout="vertical" />
          </template>
        </t-space>
      </template>
      <template #footerSummary v-if="['evaluation', 'review'].includes(props.mode)">
        <div class="text-center">
          <i18n-t keypath="pages.assessmentTaskContentTable.summary">
            <template #totalScore>
              <span class="t-link--theme-primary" v-if="props.mode === 'review'">{{ editScoreContent.totalScore }}</span>
              <span class="t-link--theme-primary" v-else-if="props.mode === 'evaluation'">{{ totalScore }}</span>
            </template>
            <template #totalSubtractScore>
              <span class="t-link--theme-success" v-if="props.mode === 'review'">{{ editScoreContent.totalSubtractScore }}</span>
              <span class="t-link--theme-success" v-else-if="props.mode === 'evaluation'">{{ totalSubtractScore }}</span>
            </template>
            <template #totalAddScore>
              <span class="t-link--theme-danger" v-if="props.mode === 'review'">{{ editScoreContent.totalAddScore }}</span>
              <span class="t-link--theme-danger" v-else-if="props.mode === 'evaluation'">{{ totalAddScore }}</span>
            </template>
            <template #grade>
              <span class="t-link--theme-danger" v-if="props.mode === 'review'">{{ editScoreContent.grade }}</span>
              <span class="t-link--theme-danger" v-else-if="props.mode === 'evaluation'">{{ '-' }}</span>
            </template>
          </i18n-t>
        </div>
      </template>
    </t-table>
  </div>
</template>

<style scoped lang="less">
.t-table {
  :deep(.t-table__expanded-row) {
    td[colspan="4"] {
      border-left: none;
    }

    .t-table__row-full-element {
      padding: 0;
    }
  }

  :deep(.t-table__footer) {
    tr:not(.t-table__row--full) {
      display: none;
    }

    td {
      padding: 0;
    }

    .t-table__row-full-element {
      padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-s);
    }
  }
}

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
    border-bottom: none;
  }
}
</style>
