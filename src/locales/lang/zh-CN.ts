import assign from 'lodash/assign';

const locale = import.meta.glob('./zh-CN/*.ts', { eager: true });

export default {
  lang: '简体中文',
  ...assign({}, ...Object.values(locale).map((item: any) => item.default)),
};
