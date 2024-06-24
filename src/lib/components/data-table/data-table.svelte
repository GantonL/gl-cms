<script lang="ts">
  import { type Column, createTable, Subscribe , Render, 
    type HeaderRow, 
    type BodyRow, 
    type TableAttributes, 
    type TableBodyAttributes, 
	Table, 
	type TableViewModel} from "svelte-headless-table";
  import { readable, writable, type Readable, type Writable } from "svelte/store";
  import * as TableComponent from "$lib/components/ui/table";
	import { afterUpdate, createEventDispatcher, onMount } from "svelte";
  import { type TableColumn, type TableConfiguration }from "$lib/models/table";
  import { addPagination, type NewTablePropSet, type PaginationConfig, type PaginationState, type PluginStates, type TablePlugin } from "svelte-headless-table/plugins";
  import { Button } from "$lib/components/ui/button";
	import { Plus } from "lucide-svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import { toast } from "svelte-sonner";

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
  let serverPaginationInprogress = false; 
  let tableData: Writable<any[]>; 

  afterUpdate(() => {
    if (tableData) {
      tableData.update((value) => value = data);
    }
  });
  
  onMount(() => {
    let serverSideOptions: PaginationConfig = {};
    if (configuration?.serverSide) {
      serverSideOptions = {
        serverSide: true,
        serverItemCount: readable(configuration.serverSide.totalItems),
      }
    }
    tableData = writable(data);
    const table = createTable(tableData, {
      page: addPagination(serverSideOptions),
    });
    columns = getColumns(configuration.columns(dispatch), table);
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
  
  function getColumns(config: TableColumn<any>[], table: Table<any, any>): Column<any>[] {
    return config.map((item) => {
      return table.column({
        accessor: item.dataPath ?? '',
        header: item.header ?? '',
        cell: item.cell,
      });
    })
  }

  let debounceSearchPhraseTimer: string | number | NodeJS.Timeout | undefined;
  function debounceSearchPhrase(event: InputEvent) {
    clearTimeout(debounceSearchPhraseTimer);
    debounceSearchPhraseTimer = setTimeout(() => {
      dispatch('search', event?.target?.value);
    }, configuration?.search?.debounceTime ?? 250);
  }

  function paginateNextOrPrevious(index: number) {
    if (!configuration?.serverSide) {
      $pageIndex = index;
    } else {
      const route = configuration.serverSide.route;
      serverPaginationInprogress = true;
      const failure = () => {
        toast.error('Failed to fetch page data');
        serverPaginationInprogress = false;
      };
      const pageSize = configuration.pageSize;
      const lastItemIndex = index * pageSize;
      if (index < $pageIndex) {
        tableData.update(() => data.slice(lastItemIndex, lastItemIndex + pageSize));
        serverPaginationInprogress = false;
        $pageIndex = index;
        return;
      }
      const isDataInIndexExistsInMemory = data[lastItemIndex];
      if (isDataInIndexExistsInMemory) {
        tableData.update(() => data.slice(lastItemIndex, lastItemIndex + pageSize));
        serverPaginationInprogress = false;
        $pageIndex = index;
        return;
      }
      const queryParamName = configuration.serverSide.paginationQuery?.paramName; 
      const queryParamValueDataPath = configuration.serverSide.paginationQuery?.paramValueDataPath; 
      const queryParamValue = queryParamValueDataPath ? data[lastItemIndex - 1][queryParamValueDataPath] : index;
      fetch(`${route}?${queryParamName ?? 'pageIndex'}=${queryParamValue}&pageSize=${pageSize}`, {method: 'GET'})
        .then((res) => {
          res.json().then((res) => {
            const resultDataPath = configuration.serverSide?.resultDataPath;
            const incoming = resultDataPath ? res[resultDataPath] : res;
            data.push(...incoming);
            tableData.update(() => incoming);
            serverPaginationInprogress = false;
            $pageIndex = index;
          }, failure);
        }, failure);      
    }
  }

</script>

<div class="flex flex-row items-center gap-2 mb-2 w-full">
  {#if configuration?.search}
    <Input placeholder={configuration?.search?.placeholder ?? ''}
      disabled={serverPaginationInprogress}
      on:input={debounceSearchPhrase}/>
  {/if}
  {#if configuration?.createItemButton}
    <Button variant="outline" class="flex flex-row items-center gap-2 w-fit {configuration.createItemButton.class ?? ''}"
      disabled={serverPaginationInprogress}
      on:click={() => dispatch('create')}>
      {#if configuration.createItemButton.icon}
        <svelte:component this={configuration.createItemButton.icon} size=16></svelte:component>
      {:else}
        <Plus size=16/>
      {/if}
      <span>{configuration.createItemButton.label}</span>
    </Button>
  {/if}
</div>
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
      on:click={() => paginateNextOrPrevious($pageIndex - 1)}
      disabled={!$hasPreviousPage || serverPaginationInprogress}>Previous</Button
    >
    <Button
      variant="outline"
      size="sm"
      disabled={!$hasNextPage || serverPaginationInprogress}
      on:click={() => paginateNextOrPrevious($pageIndex + 1)}>Next</Button
    >
  </div>
</div>