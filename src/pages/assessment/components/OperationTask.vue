<script setup lang="ts">
import { computed, getCurrentInstance, reactive, ref, toRaw, watch } from 'vue';
import { t } from '@/locales';
import {
  type FormInstanceFunctions,
  Input,
  MessagePlugin,
  PrimaryTableCol,
  RangeInput,
  type SubmitContext
} from 'tdesign-vue-next';
import { AssessmentTaskStatus } from '@/constants';
import { useCloned } from '@vueuse/core';
import { nanoid } from 'nanoid';
import _ from 'lodash';
import { createAssessmentTask, updateAssessmentTask } from "@/api/assessment_task.api";

const props = defineProps({
  modelValue: Boolean,
  isEdit: Boolean,
  mdl: {
    type: Object,
    default: () => ({
      title: '',
      description: '',
      basicScore: null,
      startDate: null,
      endDate: null,
      status: AssessmentTaskStatus.Draft,
      gradeSetting: {
        list: [],
      },
    }),
  },
});

const emits = defineEmits(['update:modelValue', 'refresh-list']);

const { appContext } = getCurrentInstance();
const $rules = appContext.config.globalProperties.$rules;
const tableElement = ref(null);
const form = ref<FormInstanceFunctions>();

let { cloned: formData } = useCloned(props.mdl);

watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue) {
      return;
    }
    formData = useCloned(props.mdl).cloned;
    if (props.isEdit) {
      gradeSetting.dataSource = formData.value.gradeSetting?.list || [];
    }
  },
);

const handleClose = () => {
  emits('update:modelValue', false);
};

const saveDraft = reactive({
  loading: false,
});

const saveAndPublic = reactive({
  loading: false,
});

const handleSaveDraft = () => {
  saveDraft.loading = true;
  formData.value.status = AssessmentTaskStatus.Draft;
  form.value.submit();
}

const handleSavePublic = () => {
  saveAndPublic.loading = true;
  formData.value.status = AssessmentTaskStatus.Official;
  form.value.submit();
};

const handleSubmit = ({ validateResult }: SubmitContext) => {
  if (validateResult !== true) {
    saveDraft.loading = false;
    saveAndPublic.loading = false;
    return;
  }
  if (props.isEdit) {
    handleEditSubmit();
  } else {
    handleCreateSubmit();
  }
};

const handleEditSubmit = () => {
  const params = {
    title: formData.value.title,
    startDate: formData.value.startDate,
    endDate: formData.value.endDate,
    status: formData.value.status,
    description: formData.value.description,
    basicScore: formData.value.basicScore,
    gradeSetting: {
      list: toRaw(gradeSetting.dataSource),
    },
  };
  updateAssessmentTask(formData.value.id, params).then(() => {
    emits('refresh-list');
    handleClose();
    MessagePlugin.success(t('pages.message.save'));
  }).finally(() => {
    saveDraft.loading = false;
    saveAndPublic.loading = false;
  });
};

const handleCreateSubmit = () => {
  const params = {
    title: formData.value.title,
    startDate: formData.value.startDate,
    endDate: formData.value.endDate,
    status: formData.value.status,
    description: formData.value.description,
    basicScore: formData.value.basicScore,
    gradeSetting: {
      list: toRaw(gradeSetting.dataSource),
    },
  };
  createAssessmentTask(params).then(() => {
    emits('refresh-list');
    handleClose();
    MessagePlugin.success(t('pages.message.save'));
  }).finally(() => {
    saveDraft.loading = false;
    saveAndPublic.loading = false;
  });
};

const gradeSettingValidator = () => {
  return gradeSetting.dataSource.filter(item => !item.id.includes(gradeSetting.newIdPrefix)).length > 0;
};

const gradeSettingNameValidator = (val: string) => {
  const value = val.trim();
  const grades = nonEditableGradeSettingData.value.map(item => item.grade);
  return !grades.includes(value);
};

const gradeSettingScoreValidator = (val: [number, number]) => {
  // 先判断是否都是数字
  const isAllNumber = val.some(item => _.isNumber(item));
  if (!isAllNumber) {
    return false;
  }
  const [minNumber, maxNumber] = val.map(item => _.toNumber(item));
  // 判断第一个是否小于等于第二个
  const isLessThanOrEqual = minNumber <= maxNumber;
  if (!isLessThanOrEqual) {
    return false;
  }
  // 判断两个数字是否不在其他等级分数范围中和判断其他范围的分数不在这两个数字之间
  const isInOtherRange = nonEditableGradeSettingData.value.some(item => {
    const [min, max] = item.score;
    return _.inRange(minNumber, min, max + 1) ||
      _.inRange(maxNumber, min, max + 1) ||
      _.inRange(min, minNumber, maxNumber + 1) ||
      _.inRange(max, minNumber, maxNumber + 1)
    ;
  });

  return !isInOtherRange;
}

const gradeSetting = reactive({
  dataSource: [],
  columns: [
    {
      colKey: 'grade',
      title: t('pages.assessment_task.form.gradeSetting.table.grade'),
      align: 'center',
      edit: {
        component: Input,
        props: {
          align: 'center',
          autofocus: true,
          size: 'small',
          maxlength: 100,
          placeholder: t('pages.form.placeholder', { field: t('pages.assessment_task.form.gradeSetting.table.grade') }),
        },
        rules: $rules.inputRules('pages.assessment_task.form.gradeSetting.table.grade', true, gradeSettingNameValidator),
        validateTrigger: 'change',
        showEditIcon: false,
        on: ({ row, rowIndex }) => ({
          onEnter: () => {
            handleGradeSettingRowSave(row, rowIndex);
          },
        }),
      },
    },
    {
      colKey: 'score',
      title: t('pages.assessment_task.form.gradeSetting.table.score'),
      align: 'center',
      edit: {
        component: RangeInput,
        props: {
          size: 'small',
          inputProps: {
            align: 'center',
            type: 'number',
          },
          placeholder: t('pages.form.placeholder', { field: t('pages.assessment_task.form.gradeSetting.table.score') }),
        },
        rules: $rules.inputRules('pages.assessment_task.form.gradeSetting.table.score', true, gradeSettingScoreValidator),
        validateTrigger: 'change',
        showEditIcon: false,
        on: ({ row, rowIndex }) => ({
          onEnter: () => {
            handleGradeSettingRowSave(row, rowIndex);
          },
        }),
      },
    },
    {
      colKey: 'operation',
      title: t('pages.record.operation.label'),
      width: 100,
      align: 'center',
    },
  ] as PrimaryTableCol[],
  editableRowKeys: [],
  tableEditMap: {} as Record<string, any>,
  newIdPrefix: 'create-',
});

const nonEditableGradeSettingData = computed(() => {
  return gradeSetting.dataSource.filter(item => !gradeSetting.editableRowKeys.includes(item.id));
});

const handleGradeSettingDataChange = (params: any) => {
  const { row, editedRow } = params;
  gradeSetting.tableEditMap[row.id] = editedRow;
};

const handleGradeSettingRowEdit = (row: any) => {
  if (!gradeSetting.editableRowKeys.includes(row.id)) {
    gradeSetting.editableRowKeys.push(row.id);
  }
  gradeSetting.tableEditMap[row.id] = toRaw(row);
};

const handleGradeSettingRowSave = (row: any, rowIndex: number) => {
  tableElement.value.validateRowData(row.id).then((params: any) => {
    if (params.result.length > 0) {
      return;
    }
    const data = gradeSetting.tableEditMap[row.id];
    const editableRowKeyIndex = gradeSetting.editableRowKeys.findIndex((id) => id === row.id);
    gradeSetting.editableRowKeys.splice(editableRowKeyIndex, 1);
    // 将ID改成正式编号
    data.id = nanoid(6);
    // 将等级名称去除空格
    data.grade = data.grade.trim();
    gradeSetting.dataSource.splice(rowIndex, 1, data);
    form.value.validate({
      fields: ['gradeSetting'],
    });
  })
};

const handleGradeSettingRowCancel = (row: any, rowIndex: number) => {
  const editableRowKeyIndex = gradeSetting.editableRowKeys.findIndex((id) => id === row.id);
  gradeSetting.editableRowKeys.splice(editableRowKeyIndex, 1);
  tableElement.value.clearValidateData();
  if (row.id.includes(gradeSetting.newIdPrefix)) {
    gradeSetting.dataSource.splice(rowIndex, 1);
  }
};

const handleGradeSettingDeleteConfirm = (rowIndex: number) => {
  gradeSetting.dataSource.splice(rowIndex, 1);
  form.value.validate({
    fields: ['gradeSetting'],
  });
};

const handleAddGrade = () => {
  const newRow = {
    id: `${gradeSetting.newIdPrefix}${nanoid(6)}`
  };
  gradeSetting.dataSource.push(newRow);
  handleShowGradeUpdate(newRow);
};

const handleShowGradeUpdate = (row: any) => {
  if (!gradeSetting.editableRowKeys.includes(row.id)) {
    gradeSetting.editableRowKeys.push(row.id);
  }
  gradeSetting.tableEditMap[row.id] = toRaw(row);
}
</script>
<template>
  <t-drawer
    :visible="props.modelValue"
    v-bind="$attrs"
    :closeBtn="true"
    :closeOnOverlayClick="false"
    :preventScrollThrough="true"
    :size-draggable="true"
    :destroyOnClose="true"
    size="800px"
    @close="handleClose"
  >
    <template #header>
      {{ isEdit ? $t('pages.assessment_task.update') : $t('pages.assessment_task.create') }}
    </template>
    <t-form ref="form" :data="formData" scroll-to-first-error="smooth" labelWidth="120px" @submit="handleSubmit">
      <div class="form-title">{{ $t('pages.assessment_task.form.basic.title') }}</div>
      <t-form-item
        :label="$t('pages.assessment_task.title')"
        name="title"
        :rules="$rules.inputRules('pages.assessment_task.title')"
      >
        <t-input
          autofocus
          v-model="formData.title"
          clearable
          :maxlength="150"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.assessment_task.title') })"
          @enter="handleSaveDraft"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.assessment_task.startDate')"
        name="startDate"
        :rules="$rules.selectRules('pages.assessment_task.startDate')"
      >
        <t-date-picker
          allowInput
          valueType="YYYY-MM-DD"
          v-model="formData.startDate"
          :placeholder="$t('pages.form.selectPlaceholder', { field: $t('pages.assessment_task.startDate') })"
          style="width: 100%;"
        />
      </t-form-item>
      <t-form-item
        :label="$t('pages.assessment_task.endDate')"
        name="endDate"
        :rules="$rules.selectRules('pages.assessment_task.endDate')"
      >
        <t-date-picker
          allowInput
          valueType="YYYY-MM-DD"
          v-model="formData.endDate"
          :placeholder="$t('pages.form.selectPlaceholder', { field: $t('pages.assessment_task.endDate') })"
          style="width: 100%;"
        />
      </t-form-item>
      <t-form-item
        :label="$t('pages.assessment_task.description')"
        name="description"
        :rules="$rules.inputRules('pages.assessment_task.description', false)"
      >
        <t-textarea
          v-model="formData.description"
          clearable
          :maxlength="150"
          :autosize="{ minRows: 4, maxRows: 6 }"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.assessment_task.description') })"
        />
      </t-form-item>
      <div class="form-title">{{ $t('pages.assessment_task.form.gradeSetting.title') }}</div>
      <t-form-item
        :label="$t('pages.assessment_task.basicScore')"
        name="basicScore"
        :rules="$rules.inputNumberRules('pages.assessment_task.basicScore')"
      >
        <t-input-number
          v-model="formData.basicScore"
          clearable
          theme="column"
          style="width: 200px;"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.assessment_task.basicScore') })"
          @enter="handleSaveDraft"
        >
        </t-input-number>
      </t-form-item>
      <t-form-item
        :label="$t('pages.assessment_task.gradeSetting')"
        name="gradeSetting"
        :rules="$rules.customValidatorRules('pages.assessment_task.gradeSetting', gradeSettingValidator)"
      >
        <t-table
          ref="tableElement"
          row-key="id"
          :columns="gradeSetting.columns"
          :data="gradeSetting.dataSource"
          table-layout="fixed"
          bordered
          cell-empty-content="-"
          size="small"
          :max-height="400"
          :editable-row-keys="gradeSetting.editableRowKeys"
          @row-edit="handleGradeSettingDataChange"
        >
          <template #score="{ row }">
            <div style="line-height: 24px;">
              {{ row.score.join(' - ') }}
            </div>
          </template>
          <template #operation="{ row, rowIndex }">
            <t-space align="center" :size="0">
              <template v-if="gradeSetting.editableRowKeys.includes(row.id)">
                <t-link hover="color" theme="primary" @click="handleGradeSettingRowSave(row, rowIndex)">
                  {{ $t('pages.record.operation.save') }}
                </t-link>
                <t-link hover="color" theme="danger" @click="handleGradeSettingRowCancel(row, rowIndex)">
                  {{ $t('pages.record.operation.cancel') }}
                </t-link>
              </template>
              <template v-else>
                <t-link hover="color" theme="primary" @click="handleGradeSettingRowEdit(row)" :disabled="gradeSetting.editableRowKeys.length > 0">
                  {{ $t('pages.record.operation.update') }}
                </t-link>
                <t-popconfirm
                  theme="danger"
                  :content="$t('pages.record.operation.deleteConfirm')"
                  @confirm="handleGradeSettingDeleteConfirm(rowIndex)"
                  :disabled="gradeSetting.editableRowKeys.length > 0"
                >
                  <t-link hover="color" theme="danger" :disabled="gradeSetting.editableRowKeys.length > 0">{{ $t('pages.record.operation.delete') }}</t-link>
                </t-popconfirm>
              </template>
              <template #separator>
                <t-divider layout="vertical" />
              </template>
            </t-space>
          </template>
          <template #footerSummary>
            <div class="t-table__row-filter-inner">
              <t-button
                size="small"
                variant="text"
                theme="primary"
                class="icon-operation"
                @click="handleAddGrade"
                :disabled="gradeSetting.editableRowKeys.length > 0"
              >
                <template #icon><span class="t-icon i-material-symbols-add-circle"></span></template>
                {{ $t('pages.assessment_task.form.gradeSetting.add') }}
              </t-button>
            </div>
          </template>
        </t-table>
      </t-form-item>
    </t-form>
    <template #footer>
      <t-button variant="outline" @click="handleSaveDraft" :loading="saveDraft.loading">
        {{ $t('pages.assessment_task.save.draft') }}
      </t-button>
      <t-popconfirm
        theme="danger"
        :content="$t('pages.assessment_task.save.publicConfirm')"
        @confirm="handleSavePublic"
      >
        <t-button :loading="saveAndPublic.loading">{{ $t('pages.assessment_task.save.public') }}</t-button>
      </t-popconfirm>
    </template>
  </t-drawer>
</template>

<style scoped lang="less">
.form-title {
  font: var(--td-font-title-large);
  font-weight: bold;
  color: var(--td-text-color-primary);
  margin: 0 0 var(--td-comp-margin-xl) 0;
  width: 96px;
  text-align: right;
}

:deep(.t-table) {
  .t-table__footer {
    .t-table__row-full-element {
      padding: 0;
    }
  }

  .t-tips.t-is-error {
    display: none;
  }
}
</style>
