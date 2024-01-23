export default {
  page: {
    title: '考核任务管理',
  },
  create: '新增考核任务',
  update: '编辑考核任务',
  title: '任务标题',
  date: '考核时间段',
  startDate: '考核开始时间',
  endDate: '考核结束时间',
  description: '考核任务简介',
  content: '考核内容',
  status: '状态',
  statusMap: {
    draft: '未发布',
    official: '已发布',
    done: '已完成',
    cancellation: '已作废',
  },
  basicScore: '考核基础分',
  gradeSetting: '分数等级配置',
  createdDate: '新增时间',
  updatedDate: '修改时间',
  form: {
    basic: {
      title: '基本信息',
    },
    gradeSetting: {
      title: '分数等级',
      table: {
        grade: '等级',
        score: '分数段',
      },
      add: '添加等级',
    },
  },
  save: {
    draft: '保存草稿',
    public: '保存并发布',
    publicConfirm: '确定要发布吗？发布后考核任务内容将无法修改。',
  },
  process: {
    title: '考核进度',
  },
  contentTable: {
    title: '考核项目',
    desc: '考核内容',
    score: '分数',
    operation: {
      evaluation: '评分',
    },
  },
  statistic: {
    header: {
      total: '参与考核学校总数',
      submitted: '已提交数量',
      pending: '未提交数量',
      returned: '已退回数量',
      donePercentage: '完成率',
      schoolUnit: '所',
      detailButton: '考核任务明细',
    },
  },
  done: {
    button: '完成考核',
  },
};
