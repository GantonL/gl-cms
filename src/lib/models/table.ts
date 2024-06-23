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
  serverSide?: {
    totalItems: number;
    route: string;
    paginationQuery?: {
      paramName?: string;
      paramValueDataPath?: keyof T | string;
    };
    resultDataPath?: string;
  }
}
