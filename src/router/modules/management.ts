import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/management',
    name: 'management',
    component: Layout,
    redirect: '/management/company',
    meta: {
      title: {
        zh_CN: '系统管理',
        en_US: 'System Management',
      },
      icon: 'layers',
    },
    children: [
      {
        path: 'school',
        name: 'SchoolManage',
        component: () => import('@/pages/management/school/index.vue'),
        meta: {
          title: {
            zh_CN: '学校管理',
            en_US: 'School',
          },
          icon: 'city-13',
        },
      },
      {
        path: 'company',
        name: 'CompanyManage',
        component: () => import('@/pages/management/company/index.vue'),
        meta: {
          title: {
            zh_CN: '保安公司管理',
            en_US: 'Security Company',
          },
          icon: 'dam-7',
        },
      },
      {
        path: 'assessment',
        name: 'AssessmentManage',
        component: () => import('@/pages/management/assessment/index.vue'),
        meta: {
          title: {
            zh_CN: '考核管理',
            en_US: 'Assessment',
          },
          icon: 'tree-list',
        },
      },
    ],
  },
];
