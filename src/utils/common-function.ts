import { recursiveFlat } from '@/utils/array';

export const getCommonFunctions = (router: any[]): any[] => {
  const routes = recursiveFlat(router).filter((item: any) => !item.redirect);
  return routes.map((item: any) => ({
    label: item.meta.title.zh_CN,
    routeName: item.name,
    icon: item.meta.icon,
  }));
}
