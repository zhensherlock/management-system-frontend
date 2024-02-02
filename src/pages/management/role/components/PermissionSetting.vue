<script setup lang="ts">
import { ref, watch, onMounted, reactive } from 'vue';
import { updatePermission } from '@/api/role';
import { t } from '@/locales';
import { getModuleTree } from '@/api/module';
import { recursiveMap } from '@/utils/array';
import { useTable } from '@/composeable/useTable';
import { MessagePlugin, PrimaryTableCol } from 'tdesign-vue-next';

const props = defineProps({
  modelValue: Boolean,
  role: {
    type: Object,
    default: () => ({})
  },
});
const emits = defineEmits(['update:modelValue', 'refresh-list']);

const selectedModuleMap: {[key: string]: any} = {};

onMounted(() => {
  fetchModuleData();
});

const module = reactive({
  checked: [],
  treeData: []
});

const fetchModuleData = async () => {
  const res: any = await getModuleTree();
  module.treeData = recursiveMap(res.list, (item: any) => ({
    label: item.name,
    title: item.name,
    value: item.id,
    operations: item.operations,
  }));
}

watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue) {
      module.checked = [];
      operation.selectedRowKeys = [];
      operation.dataSource = [];
      operation.currentModule = null;
      return;
    }
    props.role?.moduleRoleMappings.forEach((item: any) => {
      selectedModuleMap[item.moduleId] = item.operationOptions || [];
    })
    module.checked = props.role?.moduleRoleMappings.map((item: any) => item.moduleId) || [];
  },
);

const handleConfirm = async () => {
  await updatePermission(props.role.id, {
    permissions: module.checked.map(id => ({
      moduleId: id,
      operationOptions: selectedModuleMap[id],
    })),
  });
  emits('update:modelValue', false);
  emits('refresh-list');
  MessagePlugin.success(t('pages.message.permission.success'));
};

const handleClose = () => {
  emits('update:modelValue', false);
};

const tableParentElement = ref(null);
const tableElement = ref(null);
const operation = reactive({
  loading: false,
  total: 0,
  currentModule: null,
  dataSource: [],
  selectedRowKeys: [],
  columns: [
    {
      colKey: 'row-select',
      type: 'multiple',
      width: 50,
    },
    {
      colKey: 'name',
      title: t('pages.operation.name'),
    },
    {
      colKey: 'code',
      title: t('pages.operation.code'),
    },
  ] as PrimaryTableCol[],
});
const { isEmpty, loadingProps, tableHeight } = useTable({
  total: operation.total,
  table: tableElement,
  parent: tableParentElement,
  loading: operation.loading,
  hiddenPage: true,
});

const handleChangeModuleChecked = (_: any, context: any) => {
  if (context.node.checked) {
    selectedModuleMap[context.node.value] = context.node.data.operations.map((item: any) => {
      return {
        id: item.id,
        code: item.code,
      };
    });
  }
}

const handleShowOperationTable = (node: any) => {
  operation.currentModule = node;
  operation.dataSource = node.data.operations;
  operation.total = node.data.operations.length;
  operation.selectedRowKeys = selectedModuleMap[node.value].map((item: any) => item.id);
}

const handleOperationSelectChange = (_: string[], options: any) => {
  selectedModuleMap[operation.currentModule.value] = options.selectedRowData.map((item: any) => {
    return {
      id: item.id,
      code: item.code,
    };
  });
}
</script>

<template>
  <t-dialog
    class="dialog"
    :visible="props.modelValue"
    v-bind="$attrs"
    :closeOnOverlayClick="false"
    @close="handleClose"
    :destroyOnClose="true"
    @confirm="handleConfirm"
    width="900px"
    placement="center"
  >
    <template #header>
      {{ role?.name }} - {{ $t('pages.role.permissionSetting') }}
    </template>
    <div class="overflow-hidden">
      <t-row :gutter="16">
        <t-col :flex="2" class="tree-wrap">
          <perfect-scrollbar class="tree-scrollbar">
            <t-tree
              v-model="module.checked"
              :data="module.treeData"
              :activable="false"
              :active-multiple="false"
              :expand-on-click-node="true"
              :checkable="true"
              expand-all
              icon
              line
              value-mode="all"
              @change="handleChangeModuleChecked"
            >
              <template #label="{ node }">
                <div class="flex justify-between">
                  <div>{{ node.label }}</div>
                  <div v-show="node.checked">
                    <t-button
                      size="small"
                      variant="text"
                      theme="primary"
                      class="icon-operation"
                      @click.prevent="handleShowOperationTable(node)"
                    >
                      <template #icon><span class="t-icon i-mdi-format-list-checks"></span></template>
                    </t-button>
                  </div>
                </div>
              </template>
            </t-tree>
          </perfect-scrollbar>
        </t-col>
        <t-col :flex="3" ref="tableParentElement">
          <Result type="empty" v-if="!operation.currentModule">
            <template #tip>
              <i18n-t keypath="pages.message.permission.operations.default">
                <template #icon>
                  <span class="t-icon i-mdi-format-list-checks text-18px"></span>
                </template>
              </i18n-t>
            </template>
          </Result>
          <t-table
            v-else
            ref="tableElement"
            row-key="id"
            v-model:selected-row-keys="operation.selectedRowKeys"
            :columns="operation.columns"
            :data="operation.dataSource"
            table-layout="auto"
            bordered
            cell-empty-content="-"
            size="small"
            :max-height="500"
            @select-change="handleOperationSelectChange"
          >
            <template #empty>
              {{ $t('pages.message.permission.operations.empty', {  moduleName: operation.currentModule.label }) }}
            </template>
          </t-table>
        </t-col>
      </t-row>
    </div>
  </t-dialog>
</template>

<style scoped lang="less">
.tree-scrollbar {
  height: 500px;
}

.tree-wrap {
  border-right: 1px solid var(--td-component-border);

  :deep(.t-tree) {
    .t-tree__label.t-is-checked {
      background: transparent;
    }

    .t-checkbox__label {
      flex: 1;
    }
  }
}

.icon-operation {
  height: var(--td-comp-size-xxs);
}

.result-container {
  min-height: 500px;
  height: 100%;

  .t-icon {
    color: var(--td-brand-color-hover);
  }
}
</style>
