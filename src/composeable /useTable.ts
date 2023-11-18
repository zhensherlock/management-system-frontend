import type { MaybeComputedElementRef } from '@vueuse/core';
import { useResizeObserver } from '@vueuse/core';
import type { MaybeRefOrGetter } from '@vueuse/shared';
import { syncRef, toRef, toValue } from '@vueuse/shared';
import { computed, isRef, nextTick, ref, watch } from 'vue';

export interface UseTableOptions {
  loading: MaybeRefOrGetter<boolean>;
  total: MaybeRefOrGetter<number>;
  pageSize?: MaybeRefOrGetter<number>;
  parent: MaybeComputedElementRef | MaybeComputedElementRef[];
  excludeHeightElements?: string[];
}

export function useTable(options: UseTableOptions) {
  const { loading = false, total = 0, pageSize = 20, parent, excludeHeightElements = [] } = options;

  const currentTotal = ref(0);

  if (isRef(total)) {
    syncRef(total, currentTotal);
  }

  const tableHeight = ref(0);

  const loadingProps = ref({
    text: '加载中...',
  });

  const pagination = computed(() => {
    return toValue(total) > toValue(pageSize)
      ? {
          defaultPageSize: toValue(pageSize),
          total: 100,
          defaultCurrent: 1,
          totalContent: false,
        }
      : null;
  });

  const isEmpty = computed(() => !loading && total === 0);

  const calculateTableHeight = () => {
    const _excludeHeightElements = [...excludeHeightElements];
    if (currentTotal.value > toValue(pageSize)) {
      _excludeHeightElements.push('.t-table__pagination-wrap');
    }
    const excludeHeight = _excludeHeightElements.reduce((prev, className) => {
      const el = document.querySelector(className);
      return prev + (el?.getBoundingClientRect()?.height || 0);
    }, 0);
    tableHeight.value = (toRef(parent).value as Element).clientHeight - excludeHeight;
  };

  useResizeObserver(parent, () => {
    calculateTableHeight();
  });

  watch(currentTotal, () => {
    nextTick(() => {
      calculateTableHeight();
    });
  });

  return {
    pagination,
    isEmpty,
    loadingProps,
    tableHeight,
  };
}
