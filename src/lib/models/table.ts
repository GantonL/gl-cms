import type { Column, DataLabel } from "svelte-headless-table";

export type TableCellType = 'text' | 'component';

export interface TableColumn<T> {
  dataPath?: string;
  header?: Column<T>['header'];
  cell?: DataLabel<T>;
}

export interface TableConfiguration<T> {
  columns: TableColumn<T>[];
  pageSize: number;
}