import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { useLocale } from '@/locales/useLocale';

export interface UsePageOptions {}

export function usePage(options: UsePageOptions = {}) {
  const {} = options;

  const { locale } = useLocale();
  const route = useRoute();

  const pageTitle = computed(() => {
    const title: any = route.meta.title;
    if (typeof title === 'string') {
      return title;
    }
    return title[locale.value];
  });

  const hasOperationPermission = (code: string) => {
    const operations: any = route.meta.operations || [];
    return operations.some((item: any) => {
      return item.code === code;
    });
  };

  return {
    pageTitle,
    hasOperationPermission,
  };
}
