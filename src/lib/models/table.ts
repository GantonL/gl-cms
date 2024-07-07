import type { Icon } from "lucide-svelte";
import type { ComponentType, EventDispatcher } from "svelte";
import type { Column, DataLabel } from "svelte-headless-table";

export type TableCellType = 'text' | 'component';

export interface TableColumn<T> {
  dataPath?: string | ((item: T) => unknown);
  header?: Column<T>['header'];
  cell?: DataLabel<T>;
  class?: string;
}

interface TableQueryParams<T> {
  paramName?: string;
  paramValueDataPath?: keyof T | string;
}

export interface TableFilter<T> {
  id: string;
  type: string;
  label?: string;
  query?: TableQueryParams<T>;
  options?: {label: string, value: string}[];
  currentValue?: {label: string, value: string};
}

export interface TableConfiguration<T> {
  columns: (dispatch: EventDispatcher<Record<string, string>>) => TableColumn<T>[];
  pageSize: number;
  createItemButton?: {
    label: string;
    icon?: ComponentType<Icon>
    class?: string;
  };
  search?: {
    placeholder?: string;
    debounceTime?: number;
  };
  filters?: TableFilter<T>[];
  serverSide?: {
    totalItems: number;
    route: string;
    paginationQuery?: TableQueryParams<T>;
    resultDataPath?: string;
  }
}
