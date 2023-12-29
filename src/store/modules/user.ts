import { defineStore } from 'pinia';

import * as passportApi from '@/api/passport';
import * as profileApi from '@/api/profile';
import { usePermissionStore } from '@/store';
import type { LoginData } from '@/types/api/passport';
import type { CaptchaInfo, LoginInfo, UserInfo } from '@/types/interface';

interface IUserStore {
  token: string;
  loginInfo: LoginInfo;
  userInfo: UserInfo;
  captchaInfo: CaptchaInfo;
  showCaptcha: boolean;
}

const InitUserInfo: UserInfo = {
  name: '', // 用户名，用于展示在页面右上角头像处
  roles: [], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
  realName: '',
  email: '',
  tel: '',
  organizations: [],
};

export const useUserStore = defineStore('user', {
  state: (): IUserStore => ({
    // token: 'main_token', // 默认token不走权限
    token: '',
    loginInfo: null,
    userInfo: { ...InitUserInfo },
    captchaInfo: null,
    showCaptcha: false,
  }),
  getters: {
    roles: (state) => {
      return state.userInfo?.roles;
    },
  },
  actions: {
    async login(userInfo: LoginData) {
      const loginResult = await passportApi.login(userInfo);
      // const mockLogin = async (userInfo: Record<string, unknown>) => {
      //   // 登录请求流程
      //   console.log(`用户信息:`, userInfo);
      //   // const { account, password } = userInfo;
      //   // if (account !== 'td') {
      //   //   return {
      //   //     code: 401,
      //   //     message: '账号不存在',
      //   //   };
      //   // }
      //   // if (['main_', 'dev_'].indexOf(password) === -1) {
      //   //   return {
      //   //     code: 401,
      //   //     message: '密码错误',
      //   //   };
      //   // }
      //   // const token = {
      //   //   main_: 'main_token',
      //   //   dev_: 'dev_token',
      //   // }[password];
      //   return {
      //     code: 200,
      //     message: '登录成功',
      //     data: 'main_token',
      //   };
      // };

      // const res = await mockLogin(userInfo);
      if (loginResult) {
        this.loginInfo = loginResult;
      }
    },
    async getUserInfo() {
      // const mockRemoteUserInfo = async (token: string) => {
      //   if (token === 'main_token') {
      //     return {
      //       name: 'Tencent',
      //       roles: ['all'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
      //     };
      //   }
      //   return {
      //     name: 'td_dev',
      //     roles: ['UserIndex', 'DashboardBase', 'login'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
      //   };
      // };
      // const res = await mockRemoteUserInfo(this.token);
      const data = await profileApi.getProfile();
      this.setUserInfo(data);
    },
    setUserInfo(data: UserInfo) {
      this.userInfo = data;
    },
    async logout() {
      this.token = '';
      this.loginInfo = null;
      this.userInfo = { ...InitUserInfo };
    },
    async getCaptcha() {
      this.captchaInfo = await passportApi.captcha();
    },
  },
  persist: {
    afterRestore: () => {
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes();
    },
    key: 'user',
    paths: ['loginInfo', 'showCaptcha'],
  },
});
