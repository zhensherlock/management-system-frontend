<script setup lang="ts">
import dayjs from 'dayjs';
import type { FormInstanceFunctions, SubmitContext } from 'tdesign-vue-next';
import { ref, watch } from 'vue';
import { useCloned } from '@vueuse/core';
import _ from 'lodash';
import { createEmployee, updateEmployee } from '@/api/employee';
import { createWorkOrder } from '@/api/work_order';
import { MessagePlugin } from 'tdesign-vue-next';
import { t } from '@/locales';
import { EmployeeSexList, EmployeeStatus, EmployeeStatusList, WorkOrderType } from '@/constants';

const props = defineProps({
  modelValue: Boolean,
  action: {
    type: String,
    default: 'modify',
  },
  isEdit: Boolean,
  schoolList: {
    type: Array,
    default: () => [],
  },
  companyList: {
    type: Array,
    default: () => [],
  },
  mdl: {
    type: Object,
    default() {
      return {
        jobNumber: '001',
        name: '覃欢',
        sex: '',
        avatar: '',
        certificateNumber: 'B001',
        contact: '14597229740',
        description: '',
        birthday: dayjs().subtract(40, 'year'),
        idCard: '3518784210555247',
        status: EmployeeStatus.Normal,
        companyOrganizationId: '',
        schoolOrganizationId: '',
      };
    },
  },
});
const emits = defineEmits(['update:modelValue', 'refresh-list']);

const form = ref<FormInstanceFunctions>();

let { cloned: formData } = useCloned(props.mdl);

watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue) {
      return;
    }
    formData = useCloned(props.mdl).cloned;
  },
);

const handleConfirm = () => {
  form.value.submit();
};

const getDifferentFields = (originalObj: Record<string, any>, newObj: Record<string, any>) => {
  const fields: any[] = [];
  const originalObjKeys: string[] = Object.keys(originalObj);
  // const keys2: string[] = Object.keys(obj2);
  originalObjKeys.forEach((key: string) => {
    if (!_.isEqual(originalObj[key], newObj[key])) {
      fields.push({
        label: t(`pages.employee.${key}`),
        originalValue: originalObj[key],
        newValue: newObj[key],
      });
    }
  })
  console.log(fields);
  return fields;
}

const handleSubmit = ({ validateResult }: SubmitContext) => {
  if (validateResult !== true) {
    return;
  }
  if (props.action === 'apply') {
    const fields = getDifferentFields(props.mdl, formData.value);
    if (fields.length <= 0) {
      MessagePlugin.warning(t('pages.employee.apply.noChange'));
      return;
    }
    // 保安公司提交员工信息变更工单
    if (props.isEdit) {
      handleCreateWorkOrderSubmit(WorkOrderType.ModifyEmployee, fields);
    } else {
      handleCreateWorkOrderSubmit(WorkOrderType.AddEmployee, fields);
    }
  } else {
    // 正常维护员工信息
    if (props.isEdit) {
      handleEditSubmit();
    } else {
      handleCreateSubmit();
    }
  }
};

const handleEditSubmit = () => {
  const params = {
    jobNumber: formData.value.jobNumber,
    name: formData.value.name,
    sex: formData.value.sex,
    description: formData.value.description,
    certificateNumber: formData.value.certificateNumber,
    contact: formData.value.contact,
    birthday: formData.value.birthday,
    idCard: formData.value.idCard,
    status: formData.value.status,
    companyOrganizationId: formData.value.companyOrganizationId,
    schoolOrganizationId: formData.value.schoolOrganizationId,
  };
  updateEmployee(formData.value.id, params).then(() => {
    _.merge(props.mdl, params);
    handleClose();
    MessagePlugin.success(t('pages.message.update'));
  });
};

const handleCreateSubmit = () => {
  const params = {
    jobNumber: formData.value.jobNumber,
    name: formData.value.name,
    sex: formData.value.sex,
    description: formData.value.description,
    certificateNumber: formData.value.certificateNumber,
    contact: formData.value.contact,
    birthday: formData.value.birthday,
    idCard: formData.value.idCard,
    status: formData.value.status,
    companyOrganizationId: formData.value.companyOrganizationId,
    schoolOrganizationId: formData.value.schoolOrganizationId,
  };
  createEmployee(params).then(() => {
    emits('refresh-list');
    handleClose();
    MessagePlugin.success(t('pages.message.create'));
  });
};

const handleCreateWorkOrderSubmit = (type: number, details: any[]) => {
  const params = {
    employeeId: formData.value.id,
    content: {
      type,
      employee: {
        id: formData.value.id,
        details,
      },
    },
    type,
    applyReason: '',
  };
  createWorkOrder(params).then(() => {
    MessagePlugin.success(t('pages.workOrder.apply.message'));
  })
}

const handleClose = () => {
  emits('update:modelValue', false);
};
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
    width="600px"
    placement="center"
  >
    <template #header>
      <template v-if="action === 'modify'">
        {{ isEdit ? $t('pages.employee.update') : $t('pages.employee.create') }}
      </template>
      <template v-else-if="action === 'apply'">
        {{ isEdit ? $t('pages.employee.apply.dialog.update') : $t('pages.employee.apply.dialog.create') }}
      </template>
    </template>
    <t-form ref="form" :data="formData" scroll-to-first-error="smooth" labelWidth="110px" @submit="handleSubmit">
      <t-form-item
        :label="$t('pages.employee.jobNumber')"
        name="jobNumber"
        :rules="$rules.inputRules('pages.employee.jobNumber')"
      >
        <t-input
          autofocus
          v-model="formData.jobNumber"
          clearable
          :maxlength="100"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.employee.jobNumber') })"
          @enter="handleConfirm"
        >
        </t-input>
      </t-form-item>
      <t-form-item :label="$t('pages.employee.name')" name="name" :rules="$rules.inputRules('pages.employee.name')">
        <t-input
          v-model="formData.name"
          clearable
          :maxlength="40"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.employee.name') })"
          @enter="handleConfirm"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.employee.birthday')"
        name="birthday"
        :rules="$rules.inputRules('pages.employee.birthday')"
      >
        <t-date-picker
          allowInput
          v-model="formData.birthday"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.employee.birthday') })"
          @enter="handleConfirm"
        />
      </t-form-item>
      <t-form-item
        v-if="action === 'modify'"
        :label="$t('pages.employee.company')"
        name="companyOrganizationId"
        :rules="$rules.selectRules('pages.employee.company')"
      >
        <t-cascader
          :options="companyList"
          :showAllLevels="true"
          v-model="formData.companyOrganizationId"
          clearable
          filterable
          :placeholder="$t('pages.form.selectPlaceholder', { field: $t('pages.employee.company') })"
        />
      </t-form-item>
      <t-form-item :label="$t('pages.employee.school')" name="schoolOrganizationId">
        <t-cascader
          :options="schoolList"
          :showAllLevels="true"
          v-model="formData.schoolOrganizationId"
          clearable
          filterable
          :placeholder="$t('pages.form.selectPlaceholder', { field: $t('pages.employee.school') })"
        />
      </t-form-item>
      <t-form-item :label="$t('pages.employee.sex')" name="sex" :rules="$rules.selectRules('pages.employee.sex')">
        <t-select
          v-model="formData.sex"
          :placeholder="$t('pages.form.selectPlaceholder', { field: $t('pages.employee.sex') })"
        >
          <t-option v-for="item in EmployeeSexList" :key="item.value" :label="$t(item.label)" :value="item.value" />
        </t-select>
      </t-form-item>
      <t-form-item
        :label="$t('pages.employee.certificateNumber')"
        name="certificateNumber"
        :rules="$rules.inputRules('pages.employee.certificateNumber')"
      >
        <t-input
          v-model="formData.certificateNumber"
          clearable
          :maxlength="40"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.employee.certificateNumber') })"
          @enter="handleConfirm"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.employee.contact')"
        name="contact"
        :rules="$rules.inputRules('pages.employee.contact')"
      >
        <t-input
          v-model="formData.contact"
          clearable
          :maxlength="40"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.employee.contact') })"
          @enter="handleConfirm"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.employee.idCard')"
        name="idCard"
        :rules="$rules.inputRules('pages.employee.idCard')"
      >
        <t-input
          v-model="formData.idCard"
          clearable
          :maxlength="40"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.employee.idCard') })"
          @enter="handleConfirm"
        >
        </t-input>
      </t-form-item>
      <t-form-item
        :label="$t('pages.employee.status')"
        name="status"
        :rules="$rules.selectRules('pages.employee.status')"
      >
        <t-select
          v-model="formData.status"
          :placeholder="$t('pages.form.selectPlaceholder', { field: $t('pages.employee.status') })"
        >
          <t-option v-for="item in EmployeeStatusList" :key="item.value" :label="$t(item.label)" :value="item.value" />
        </t-select>
      </t-form-item>
      <t-form-item :label="$t('pages.employee.description')" name="description">
        <t-textarea
          v-model="formData.description"
          clearable
          :maxlength="150"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('pages.form.placeholder', { field: $t('pages.employee.description') })"
        />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<style scoped lang="less">
.t-form {
  margin-bottom: var(--td-comp-margin-xs);
}
</style>
