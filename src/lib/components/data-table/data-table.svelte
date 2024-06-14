<script lang="ts">
  import { type Column, createTable, Subscribe , Render, 
    type HeaderRow, 
    type BodyRow, 
    type TableAttributes, 
    type TableBodyAttributes, 
	Table, 
	type TableViewModel} from "svelte-headless-table";
  import { readable, type Readable, type Writable } from "svelte/store";
  import * as TableComponent from "$lib/components/ui/table";
	import { afterUpdate, createEventDispatcher } from "svelte";
  import { type TableConfiguration }from "$lib/models/table";
  import { addPagination, type NewTablePropSet, type PaginationState, type PluginStates, type TablePlugin } from "svelte-headless-table/plugins";
  import { Button } from "$lib/components/ui/button";

  const dispatch = createEventDispatcher();

  export let data: any[] = [];
  export let configuration: TableConfiguration<any>;

  let tableViewModel: TableViewModel<any, {
    page: TablePlugin<any, PaginationState, Record<string, never>, NewTablePropSet<never>>;
  }>; 
  let columns: Column<any>[] = [];
  let headerRows: Readable<HeaderRow<any, any>[]>;
  let pageRows: Readable<BodyRow<any, any>[]>;
  let tableAttrs: Readable<TableAttributes<any, any>>;
  let tableBodyAttrs: Readable<TableBodyAttributes<any, any>>;
  let pluginStates: PluginStates<{
    page: TablePlugin<any, PaginationState, Record<string, never>, NewTablePropSet<never>>
  }>;
  let hasNextPage: Readable<boolean>;
  let hasPreviousPage: Readable<boolean>;
  let pageIndex: Writable<number>;
  let pageCount: Readable<number>;
  let pageSize: Writable<number>;


  afterUpdate(() => {
    if (!data?.length) { return; }
    if (tableViewModel) { return; }
    const table = createTable(readable(data), {
      page: addPagination(),
    });
    columns = getColumns(configuration.columns, table);
    const tableColumns = table.createColumns(columns);
    tableViewModel = table.createViewModel(tableColumns);
    headerRows = tableViewModel.headerRows;
    pageRows = tableViewModel.pageRows;
    tableAttrs = tableViewModel.tableAttrs;
    tableBodyAttrs = tableViewModel.tableBodyAttrs;
    pluginStates = tableViewModel.pluginStates;
    hasNextPage = pluginStates.page.hasNextPage;
    hasPreviousPage = pluginStates.page.hasPreviousPage;
    pageIndex = pluginStates.page.pageIndex;
    pageCount = pluginStates.page.pageCount;
    pageSize = pluginStates.page.pageSize;
    pageSize.set(configuration.pageSize);
  });
  
  function getColumns(config: TableConfiguration<any>['columns'], table: Table<any, any>): Column<any>[] {
    return config.map((item) => {
      if (item.render) {
        item.events?.forEach((eventType) => {
          item.render!.on(eventType, e => {
            dispatch(e.type, e.detail)
          });
        });
      }
      return table.column({
        accessor: item.dataPath ?? '',
        header: item.header ?? '',
        cell: item.cell,
      });
    })
  }
</script>

<div class="rounded-md border">
  {#if tableViewModel}
    <TableComponent.Root {...$tableAttrs}>
      <TableComponent.Header>
        {#each $headerRows as headerRow}
          <Subscribe rowAttrs={headerRow.attrs()}>
            <TableComponent.Row>
              {#each headerRow.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
                  <TableComponent.Head {...attrs}>
                    <Render of={cell.render()} />
                  </TableComponent.Head>
                </Subscribe>
              {/each}
            </TableComponent.Row>
          </Subscribe>
        {/each}
      </TableComponent.Header>
      <TableComponent.Body {...$tableBodyAttrs}>
        {#each $pageRows as row (row.id)}
          <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
            <TableComponent.Row {...rowAttrs}>
              {#each row.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs>
                  <TableComponent.Cell {...attrs}>
                    <Render of={cell.render()} />
                  </TableComponent.Cell>
                </Subscribe>
              {/each}
            </TableComponent.Row>
          </Subscribe>
        {/each}
      </TableComponent.Body>
    </TableComponent.Root>
  {/if}
</div>
<div class="flex flex-row items-center justify-between">
  <span class="text-muted-foreground">{$pageIndex + 1} out of {$pageCount} pages</span>
  <div class="flex items-center justify-end space-x-4 py-4">
    <Button
      variant="outline"
      size="sm"
      on:click={() => ($pageIndex--)}
      disabled={!$hasPreviousPage}>Previous</Button
    >
    <Button
      variant="outline"
      size="sm"
      disabled={!$hasNextPage}
      on:click={() => ($pageIndex++)}>Next</Button
    >
  </div>
</div>