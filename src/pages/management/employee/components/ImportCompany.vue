<script setup lang="ts">
import { ref } from 'vue';
import { DownloadIcon } from 'tdesign-icons-vue-next';
import { importEmployees } from '@/api/employee';
import { MessagePlugin } from 'tdesign-vue-next';
import { t } from '@/locales';

const props = defineProps({
  modelValue: Boolean,
});
const emits = defineEmits(['update:modelValue', 'refresh-list']);

const handleConfirm = () => {};

const handleClose = () => {
  emits('update:modelValue', false);
};

const files = ref([]);

const handleFileChange = (files: File[]) => {
  loading.value = true;
  const [file] = files;
  importEmployees(<File>file)
    .then(() => {
      loading.value = false;
      emits('refresh-list');
      handleClose();
      MessagePlugin.success(t('pages.message.import.success'));
    })
    .catch((error: Error) => {
      loading.value = false;
      MessagePlugin.error(t('pages.message.import.error', { reason: error.message }));
    });
};

const loading = ref(false);
</script>

<template>
  <t-dialog
    class="dialog"
    :visible="props.modelValue"
    v-bind="$attrs"
    :close-on-overlay-click="false"
    :destroy-on-close="true"
    @close="handleClose"
    @confirm="handleConfirm"
    :confirmBtn="null"
    width="800px"
  >
    <template #header>
      {{ $t('pages.company.import') }}
    </template>
    <div v-loading="loading">
      <t-upload
        v-model="files"
        class="upload"
        draggable
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        theme="custom"
        :auto-upload="false"
        :show-thumbnail="false"
        @select-change="handleFileChange"
      >
        <template #dragContent>
          <div class="flex flex-col items-center">
            <span class="i-ic-outline-cloud-upload block text-54px upload-icon"></span>
            <div class="mt-10px">点击或将文件拖拽到这里上传</div>
            <ul class="mt-20px flex upload-tips">
              <li class="mr-20px flex items-center">
                <t-link
                  theme="primary"
                  hover="color"
                  size="small"
                  class="upload-template-link"
                  download
                  href="/files/保安员工导入模板.xlsx"
                  @click.stop
                >
                  <download-icon slot="prefix-icon"></download-icon>
                  下载模板
                </t-link>
                按模板样式编辑好数据，切勿增减列
              </li>
              <li class="flex items-center">选择编辑好的文件，上传文件；等待一段时间，系统提示上传结果</li>
            </ul>
          </div>
        </template>
      </t-upload>
    </div>
  </t-dialog>
</template>

<style scoped lang="less">
.upload {
  width: 100%;
}
</style>
