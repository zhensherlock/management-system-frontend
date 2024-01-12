<script setup lang="ts">
import {computed, reactive, ref, watch} from 'vue';
import { t } from '@/locales';
import { MessagePlugin, PrimaryTableCol } from 'tdesign-vue-next';
import { useTable } from '@/composeable/useTable';
import {getEmployeeStatus, getSex, getWorkOrderOperationContent} from '@/utils/string';
import { auditWorkOrder } from '@/api/work_order';
import { WorkOrderStatus } from '@/constants';
import { useUserStore } from '@/store';

const props = defineProps({
  modelValue: Boolean,
  mdl: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(['update:modelValue', 'refresh-list']);

const user = useUserStore();

watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue) {
      dataSource.value = [];
      return;
    }
    props.mdl.content.employee.details.forEach((item: any) => {
      dataSource.value.push({
        path: item.path,
        label: item.label,
        originalValue: item.originalValue,
        newValue: item.newValue,
      });
    })
  },
);

const header = computed(() => {
  if (!props.mdl.content) {
    return '';
  }
  return `申请${getWorkOrderOperationContent(props.mdl.content)}`;
});

const handleClose = () => {
  emits('update:modelValue', false);
};

const tableParentElement = ref(null);
const tableElement = ref(null);
const dataSource = ref([]);
const columns = ref<PrimaryTableCol[]>([
  {
    colKey: 'label',
    title: t('pages.workOrder.field'),
  },
  {
    colKey: 'originalValue',
    title: t('pages.workOrder.originalValue'),
  },
  {
    colKey: 'newValue',
    title: t('pages.workOrder.newValue'),
  },
]);

const { tableHeight } = useTable({
  table: tableElement,
  parent: tableParentElement,
  hiddenPage: true,
});

const agree = reactive({
  loading: false,
});

const reject = reactive({
  loading: false,
});

const handleAgree = () => {
  agree.loading = true;
  auditWorkOrder(props.mdl.id, { status: WorkOrderStatus.Completed, auditReason: '' }).then(() => {
    emits('refresh-list');
    MessagePlugin.success(t('pages.workOrder.agree.submitMessage'));
    agree.loading = false;
    handleClose();
  }).catch(() => {
    agree.loading = false;
  });
}

const handleReject = () => {
  reject.loading = true;
  auditWorkOrder(props.mdl.id, { status: WorkOrderStatus.Rejected, auditReason: '' }).then(() => {
    emits('refresh-list');
    MessagePlugin.success(t('pages.workOrder.reject.submitMessage'));
    reject.loading = false;
    handleClose();
  }).catch(() => {
    reject.loading = false;
  });
}
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
    size="800px"
    @close="handleClose"
  >
    <div class="flex flex-col h-100%">
      <t-space class="mb-10px" v-if="props.mdl.status === WorkOrderStatus.Pending && user.hasEducationRole">
        <t-popconfirm
          showArrow
          placement="bottom"
          :content="$t('pages.workOrder.agree.popConfirm')"
          @confirm="handleAgree"
        >
          <t-button theme="primary" :loading="agree.loading">{{ $t('pages.workOrder.agree.button') }}</t-button>
        </t-popconfirm>
        <t-popconfirm
          showArrow
          placement="bottom"
          theme="danger"
          :content="$t('pages.workOrder.reject.popConfirm')"
          @confirm="handleReject"
        >
          <t-button theme="danger" :loading="reject.loading">{{ $t('pages.workOrder.reject.button') }}</t-button>
        </t-popconfirm>
      </t-space>
      <template v-else-if="props.mdl.status === WorkOrderStatus.Completed">
        <div class="mb-10px">
          <t-alert theme="success" :message="$t('pages.workOrder.agree.alertMessage')" />
        </div>
      </template>
      <template v-else-if="props.mdl.status === WorkOrderStatus.Rejected">
        <div class="mb-10px">
          <t-alert theme="error" :message="$t('pages.workOrder.reject.alertMessage')" />
        </div>
      </template>
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
        >
          <template #originalValue="{ row }">
            <template v-if="row.path === 'sex'">
              {{ getSex(row.originalValue) }}
            </template>
            <template v-else-if="row.path === 'status'">
              {{ getEmployeeStatus(row.originalValue) }}
            </template>
            <template v-else>
              {{ row.originalValue }}
            </template>
          </template>
          <template #newValue="{ row }">
            <template v-if="row.path === 'sex'">
              {{ getSex(row.newValue) }}
            </template>
            <template v-else-if="row.path === 'status'">
              {{ getEmployeeStatus(row.newValue) }}
            </template>
            <template v-else>
              {{ row.newValue }}
            </template>
          </template>
        </t-table>
      </div>
    </div>
  </t-drawer>
</template>

<style scoped lang="less">
:deep(.t-alert) {
  padding: var(--td-comp-paddingTB-m);
}
</style>
