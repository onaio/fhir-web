import { useCallback, useMemo, useState } from 'react';

export type FilterFunc<T extends object> = (element: T) => boolean;
export interface FilterDescription<ElementT extends object, ValueT = unknown> {
  [key: string]: {
    value?: ValueT;
    filterFunc: FilterFunc<ElementT>;
  };
}

/**
 * hook to dynamically manage data filters
 *
 * @param data - data to be filtered
 * @param initialFilterState -
 */
export function useClientSideDataGridFilters<T extends object>(
  data: T[] = [],
  initialFilterState: FilterDescription<T> = {}
) {
  const [filterRegistry, setFilterRegistry] = useState<FilterDescription<T>>(initialFilterState);

  const registerFilter = useCallback((key: string, filterFunc?: FilterFunc<T>, value?: unknown) => {
    if (filterFunc) {
      setFilterRegistry((prev) => ({ ...prev, [key]: { value, filterFunc } }));
    } else {
      setFilterRegistry((prev) => {
        delete prev[key];
        return { ...prev };
      });
    }
  }, []);

  const deregisterFilter = useCallback(
    (key: string) => {
      registerFilter(key);
    },
    [registerFilter]
  );

  const filteredData = useMemo(() => {
    const filters = Object.values(filterRegistry);

    const filteredData = [];
    dataLoop: for (const item of data) {
      for (const filter of filters) {
        if (!filter.filterFunc(item)) {
          continue dataLoop;
        }
      }
      filteredData.push(item);
    }
    return filteredData;
  }, [filterRegistry, data]);

  return {
    registerFilter,
    filteredData,
    filterRegistry,
    deregisterFilter,
  };
}
