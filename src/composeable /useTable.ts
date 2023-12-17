import type { MaybeComputedElementRef } from '@vueuse/core';
import { useResizeObserver, useDebounceFn } from '@vueuse/core';
import type { MaybeRefOrGetter } from '@vueuse/shared';
import { syncRef, toRef, toValue } from '@vueuse/shared';
import { computed, isRef, Ref, ref, watch } from 'vue';
import { nanoid } from 'nanoid';

export interface UseTableOptions {
  loading: MaybeRefOrGetter<boolean>;
  total: MaybeRefOrGetter<number>;
  pageSize?: MaybeRefOrGetter<number>;
  table?: Ref;
  parent: MaybeComputedElementRef;
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
          pageSize: toValue(pageSize),
          total: toValue(total),
          current: 1,
          totalContent: false,
        }
      : null;
  });

  const isEmpty = computed(() => !toValue(loading) && toValue(total) === 0);

  const randomTableKey = () => {
    return nanoid(6);
  };

  const tableKey = ref(randomTableKey());

  const calculateTableHeight = () => {
    const _excludeHeightElements = [...excludeHeightElements];
    if (currentTotal.value > toValue(pageSize)) {
      _excludeHeightElements.push('.t-table__pagination-wrap');
    }
    const excludeHeight = _excludeHeightElements.reduce((prev, className) => {
      const el = document.querySelector(className);
      return prev + (el?.getBoundingClientRect()?.height || 0);
    }, 0);
    const parentElement = toRef(parent).value as Element;
    if (parentElement) {
      tableHeight.value = parentElement.clientHeight - excludeHeight;
    }
    tableKey.value = randomTableKey();
  };

  const calculateTableHeightDebounceFn = useDebounceFn(
    () => {
      calculateTableHeight();
    },
    50,
    { maxWait: 300 },
  );

  useResizeObserver(parent, calculateTableHeightDebounceFn);

  watch(currentTotal, calculateTableHeightDebounceFn);

  return {
    pagination,
    isEmpty,
    loadingProps,
    tableHeight,
    tableKey,
  };
}
