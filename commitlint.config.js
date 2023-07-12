// commit-lint config
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', //  修复
        'docs', // 文档变更
        'style', // 代码格式
        'refactor', // 重构
        'perf', // 性能优化
        'test', // 增加测试
        'build', // 构建
        'ci', // CI配置
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回退
        'build', // 打包
        'types',
      ],
    ],
    // subject 大小写不做校验
    'subject-case': [0],
  },
};
