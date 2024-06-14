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
}