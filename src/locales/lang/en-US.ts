import assign from 'lodash/assign';

const locale = import.meta.glob('./en-US/*.ts', { eager: true });

export default {
  lang: 'English',
  ...assign({}, ...Object.values(locale).map((item: any) => item.default)),
};
