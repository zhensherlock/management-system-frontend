<script lang="ts">
export default {
  name: 'DashboardWorkplace',
};
</script>
<script setup lang="ts">
import { useUserStore, usePermissionStore } from '@/store';
import { getGreeting, getDeviceInfo } from '@/utils';
import defaultAvatar from '@/assets/avatar/default-avatar.png';
import { getCommonFunctions } from '@/utils/common-function';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();
const user = useUserStore();
const permission = usePermissionStore();
const deviceInfo = getDeviceInfo();
const browserData = [{
  title: 'pages.dashboard.workplace.browser.fields.name',
  value: `${deviceInfo.basic.browser.name} ${deviceInfo.basic.browser.version} (${deviceInfo.basic.engine.name})`
}, {
  title: 'pages.dashboard.workplace.browser.fields.os',
  value: `${deviceInfo.basic.os.name} ${deviceInfo.basic.os.version} ${deviceInfo.basic.platform.vendor}`
}]

const commonFunctions = getCommonFunctions(permission.asyncRoutes).filter(item => item.routeName !== route.name);

const handleRedirectCommonFunction = (item: any) => {
  router.push({
    name: item.routeName,
  });
}
</script>

<template>
  <div class="container">
    <t-row :gutter="12">
      <t-col :span="12" style="margin-bottom: var(--td-comp-paddingTB);">
        <t-card header-bordered :bordered="false">
          <t-row :gutter="15" class="items-center">
            <t-col flex="80px">
              <t-avatar :image="defaultAvatar" size="80px"></t-avatar>
            </t-col>
            <t-col flex="auto">
              <div class="text-20px font-500">
                {{ getGreeting() }}，{{ user.userInfo.realName || user.userInfo.name }}，{{ $t('pages.dashboard.workplace.greeting.welcome') }}
              </div>
              <div class="m-t-10px">
                <t-space size="small">
                  <t-tag v-for="item in user.userInfo.organizations" theme="primary" :key="item.id">
                    {{ item.name }}
                  </t-tag>
                  <t-tag v-for="item in user.userInfo.roles" theme="success" :key="item.id">
                    {{ item.name }}
                  </t-tag>
                </t-space>
              </div>
            </t-col>
          </t-row>
        </t-card>
      </t-col>
      <t-col :span="8">
        <t-card header-bordered :bordered="false" :title="$t('pages.dashboard.workplace.commonFunction.header.title')">
          <t-row :gutter="15" class="mb--15px">
            <t-col v-for="(item, index) in commonFunctions" :key="index" :span="3">
              <div class="common-function" @click="handleRedirectCommonFunction(item)">
                <t-row class="items-center">
                  <t-col flex="25px" class="flex">
                    <component :is="item.icon" class="t-icon" size="20px"></component>
                  </t-col>
                  <t-col flex="1" class="common-function__text">
                    {{ item.label }}
                  </t-col>
                </t-row>
              </div>
            </t-col>
          </t-row>
        </t-card>
      </t-col>
      <t-col :span="4">
        <t-card header-bordered :bordered="false" :title="$t('pages.dashboard.workplace.browser.header.title')">
          <t-descriptions size="small" class="browser-block" :column="1">
            <t-descriptions-item
              v-for="item in browserData"
              :label="$t(item.title)"
              :key="item.title"
            >
              {{ item.value }}
            </t-descriptions-item>
          </t-descriptions>
        </t-card>
      </t-col>
    </t-row>
  </div>
</template>

<style scoped lang="less">
.browser-block {
  :deep(.t-descriptions__label) {
    padding: 0;
  }
}

.common-function {
  padding: 15px;
  background: #F2F8FE;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 15px;

  &:hover {
    background: #E5F2FD;

    .common-function__text {
      color: var(--td-brand-color);
    }
  }

  .t-icon {
    color: var(--td-brand-color);
  }

  &__text {
    overflow: hidden;
    height: 22px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
