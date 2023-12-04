<script setup lang="ts">
import { ref } from 'vue';
import { DownloadIcon } from 'tdesign-icons-vue-next'

const props = defineProps({
  modelValue: Boolean,
});
const emits = defineEmits(['update:modelValue']);

const form = ref(null);

const handleConfirm = () => {
  form.value.submit();
};

const handleClose = () => {
  emits('update:modelValue', false);
};

const files = ref([]);

const formatResponse = (res) => {
  if (!res) {
    return { status: 'fail', error: '上传失败，原因：文件过大或网络不通' };
  }
  return res;
};
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
    width="800px"
  >
    <template #header>
      {{ $t('pages.company.import') }}
    </template>
    <t-upload
      v-model="files"
      class="upload"
      draggable
      accept=""
      action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
      theme="custom"
      :auto-upload="false"
      :show-thumbnail="false"
      :format-response="formatResponse"
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
                href="https://tdesign.gtimg.com/starter/result-page/import-template.xlsx"
                @click.stop
              >
                <download-icon slot="prefix-icon"></download-icon>
                下载模板
              </t-link>
              按模板样式编辑好数据，切勿增减列
            </li>
            <li class="flex items-center">
              选择编辑好的文件，上传文件；等待一段时间，系统提示上传结果
            </li>
          </ul>
        </div>
      </template>
    </t-upload>
  </t-dialog>
</template>

<style scoped lang="less">
.upload {
  width: 100%;
}
</style>
