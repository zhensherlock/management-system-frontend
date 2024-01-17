<script setup lang="ts">
import { computed, getCurrentInstance, reactive, ref, toRaw, watch } from 'vue';
import { t } from '@/locales';
import { getOperationList, deleteOperation, createOperation, updateOperation } from '@/api/operation';
import { MessagePlugin, PrimaryTableCol, Input } from 'tdesign-vue-next';
import { useTable } from '@/composeable/useTable';
import { SearchIcon } from 'tdesign-icons-vue-next';
import { nanoid } from 'nanoid';

const { appContext } = getCurrentInstance();
const $rules = appContext.config.globalProperties.$rules;
const newIdPrefix = 'create-';

const props = defineProps({
  modelValue: Boolean,
  module: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(['update:modelValue']);

watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue) {
      return;
    }
    fetchData();
  },
);

const fetchData = async () => {
  loading.value = true;
  try {
    // @ts-ignore
    const { list, count } = await getOperationList({
      module: props.module.id,
      keyword: inputData.keyword,
    });
    dataSource.value = list;
    total.value = count;
  } catch {
  } finally {
    loading.value = false;
  }
};

const header = computed(() => {
  if (!props.module?.name) {
    return '';
  }
  return `${props.module.name} - ${t('pages.module.buttonList')}`;
});

const handleClose = () => {
  emits('update:modelValue', false);
};

const tableParentElement = ref(null);
const tableElement = ref(null);
const total = ref(0);
const loading = ref(true);
const dataSource = ref([]);
const editableRowKeys = ref([]);
const tableEditMap: { [key: string]: any } = {};
const columns = ref<PrimaryTableCol[]>([
  {
    colKey: 'name',
    title: t('pages.operation.name'),
    edit: {
      component: Input,
      props: {
        autofocus: true,
        size: 'small',
        maxlength: 100,
        placeholder: t('pages.form.placeholder', { field: t('pages.operation.name') }),
      },
      rules: $rules.inputRules('pages.operation.name'),
      validateTrigger: 'change',
      showEditIcon: false,
    },
  },
  {
    colKey: 'code',
    title: t('pages.operation.code'),
    edit: {
      component: Input,
      props: {
        size: 'small',
        maxlength: 100,
        placeholder: t('pages.form.placeholder', { field: t('pages.operation.code') }),
      },
      rules: $rules.inputRules('pages.operation.code'),
      validateTrigger: 'change',
      showEditIcon: false,
    },
  },
  { colKey: 'operation', title: t('pages.record.operation.label'), width: 100 },
]);

const inputData = reactive({
  keyword: '',
});

const { isEmpty, loadingProps, tableHeight } = useTable({
  total,
  table: tableElement,
  parent: tableParentElement,
  loading,
  hiddenPage: true,
});

const handleAddButton = () => {
  const newRow = {
    id: `${newIdPrefix}${nanoid(6)}`,
    name: '',
    code: 'btn_',
  };
  dataSource.value.push(newRow);
  handleShowUpdate(newRow);
};

const handleShowUpdate = (row: any) => {
  if (!editableRowKeys.value.includes(row.id)) {
    editableRowKeys.value.push(row.id);
  }
  tableEditMap[row.id] = toRaw(row);
};

const handleDeleteConfirm = (row: any) => {
  deleteOperation(row.id).then(() => {
    fetchData();
    MessagePlugin.success(t('pages.message.delete'));
  });
};

const handleRowEdit = (params: any) => {
  const { row, editedRow } = params;
  tableEditMap[row.id] = editedRow;
};

const handleRowSave = (row: any, rowIndex: number) => {
  tableElement.value.validateRowData(row.id).then((params: any) => {
    if (params.result.length > 0) {
      return;
    }
    const data = tableEditMap[row.id];
    if (data.id.includes(newIdPrefix)) {
      handleCreateSubmit(data, rowIndex);
    } else {
      handleEditSubmit(data, rowIndex);
    }
  });
};

const handleCreateSubmit = (data: any, rowIndex: number) => {
  createOperation({
    name: data.name,
    code: data.code,
    moduleId: props.module.id,
  }).then((res: any) => {
    MessagePlugin.success(t('pages.message.create'));
    const editableRowKeyIndex = editableRowKeys.value.findIndex((id) => id === data.id);
    editableRowKeys.value.splice(editableRowKeyIndex, 1);
    dataSource.value.splice(rowIndex, 1, res);
  });
};

const handleEditSubmit = (data: any, rowIndex: any) => {
  updateOperation(data.id, {
    name: data.name,
    code: data.code,
    moduleId: props.module.id,
  }).then((res: any) => {
    MessagePlugin.success(t('pages.message.update'));
    const editableRowKeyIndex = editableRowKeys.value.findIndex((id) => id === data.id);
    editableRowKeys.value.splice(editableRowKeyIndex, 1);
    dataSource.value.splice(rowIndex, 1, res);
  });
};

const handleRowCancel = (row: any, rowIndex: number) => {
  const editableRowKeyIndex = editableRowKeys.value.findIndex((id) => id === row.id);
  editableRowKeys.value.splice(editableRowKeyIndex, 1);
  tableElement.value.clearValidateData();
  if (row.id.includes(newIdPrefix)) {
    dataSource.value.splice(rowIndex, 1);
  }
};
</script>
<template>
  <t-drawer
    :visible="props.modelValue"
    v-bind="$attrs"
    :header="header"
    :closeBtn="true"
    :closeOnOverlayClick="false"
    :footer="false"
    :preventScrollThrough="true"
    :size-draggable="true"
    :destroyOnClose="true"
    size="500px"
    @close="handleClose"
  >
    <div class="flex flex-col h-100%">
      <div class="flex justify-between mb-10px">
        <div>
          <t-input
            autofocus
            auto-width
            v-model="inputData.keyword"
            :label="$t('pages.operation.name')"
            :placeholder="$t('pages.form.placeholder', { field: $t('pages.operation.name') })"
            @enter="fetchData()"
          >
            <template #suffixIcon>
              <search-icon :style="{ cursor: 'pointer' }" @click="fetchData()" />
            </template>
          </t-input>
        </div>
        <div>
          <t-button theme="primary" @click="handleAddButton">{{ $t('pages.record.operation.create') }}</t-button>
        </div>
      </div>
      <div class="flex-1 overflow-hidden" ref="tableParentElement">
        <t-table
          ref="tableElement"
          row-key="id"
          :columns="columns"
          :data="dataSource"
          table-layout="auto"
          bordered
          cell-empty-content="-"
          size="small"
          :max-height="tableHeight"
          :loading="loading"
          :loadingProps="loadingProps"
          :editable-row-keys="editableRowKeys"
          @row-edit="handleRowEdit"
        >
          <template #operation="{ row, rowIndex }">
            <t-space align="center" :size="0">
              <template v-if="editableRowKeys.includes(row.id)">
                <t-link hover="color" theme="primary" @click="handleRowSave(row, rowIndex)">
                  {{ $t('pages.record.operation.save') }}
                </t-link>
                <t-link hover="color" theme="danger" @click="handleRowCancel(row, rowIndex)">
                  {{ $t('pages.record.operation.cancel') }}
                </t-link>
              </template>
              <template v-else>
                <t-link hover="color" theme="primary" @click="handleShowUpdate(row)">
                  {{ $t('pages.record.operation.update') }}
                </t-link>
                <t-popconfirm
                  theme="danger"
                  :content="$t('pages.record.operation.deleteConfirm')"
                  @confirm="handleDeleteConfirm(row)"
                >
                  <t-link hover="color" theme="danger">{{ $t('pages.record.operation.delete') }}</t-link>
                </t-popconfirm>
              </template>
              <template #separator>
                <t-divider layout="vertical" />
              </template>
            </t-space>
          </template>
        </t-table>
      </div>
    </div>
  </t-drawer>
</template>

<style scoped lang="less">
:deep(.t-table) {
  .t-tips.t-is-error {
    display: none;
  }
}
</style>
