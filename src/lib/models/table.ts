import type { Icon } from "lucide-svelte";
import type { ComponentType } from "svelte";
import type { Column, ComponentRenderConfig, DataLabel } from "svelte-headless-table";

export type TableCellType = 'text' | 'component';

export interface TableColumn<T> {
  dataPath?: string | ((item: T) => unknown);
  header?: Column<T>['header'];
  cell?: DataLabel<T>;
  class?: string;
  render?: ComponentRenderConfig;
  events?: string[];
}

export interface TableConfiguration<T> {
  columns: TableColumn<T>[];
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
