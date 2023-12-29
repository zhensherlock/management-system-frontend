import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/profile',
    name: 'profile',
    component: Layout,
    redirect: '/profile/basic',
    meta: {
      title: {
        zh_CN: '个人中心',
        en_US: 'Profile',
      },
      icon: 'user-circle',
    },
    children: [
      {
        path: 'basic',
        name: 'BasicProfile',
        component: () => import('@/pages/profile/basic/index.vue'),
        meta: {
          title: {
            zh_CN: '基本信息',
            en_US: 'BasicProfile',
          },
          icon: 'user-setting',
        },
      },
      {
        path: 'password',
        name: 'UpdatePassword',
        component: () => import('@/pages/profile/password/index.vue'),
        meta: {
          title: {
            zh_CN: '修改密码',
            en_US: 'Update Password',
          },
          icon: 'user-password',
        },
      },
    ],
  },
];
