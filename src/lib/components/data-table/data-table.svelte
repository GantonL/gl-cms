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
  import { type TableColumn, type TableConfiguration, type TableFilter }from "$lib/models/table";
  import { addPagination, type NewTablePropSet, type PaginationConfig, type PaginationState, type PluginStates, type TablePlugin } from "svelte-headless-table/plugins";
  import { Button } from "$lib/components/ui/button";
	import { LoaderCircle, Plus } from "lucide-svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import { toast } from "svelte-sonner";
	import Label from "../ui/label/label.svelte";
	import * as Select from "../ui/select";
	import { page } from "$app/stores";
	import { addSearchParamToUrl } from "$lib/client/utils";

  const dispatch = createEventDispatcher();

  export let data: any[] = [];
  export let configuration: TableConfiguration<any>;
  export let disabled = false; 

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
  let serverFetchInprogress = false;
  let filterInProgress = false; 
  let tableData: Writable<any[]>;
  let filters: Record<string, TableFilter<any>>;

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
    configuration.filters?.forEach(filter => {
      const currentValue = filter.query?.paramName ? $page.url.searchParams.get(filter.query.paramName) : undefined;
      const label = filter.options?.find(option => option.value === currentValue)?.label; 
      if (currentValue && label) {
        filter.currentValue = {
          label,
          value: currentValue, 
        }
      }
      if (filters === undefined) {
        filters = {};
      }
      filters[filter.id] = filter;
    });
  });
  
  function getColumns(config: TableColumn<any>[], table: Table<any, any>): Column<any>[] {
    const filteredConfig = config.filter(item => !item.hidden);
    return filteredConfig.map((item) => {
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
      serverFetchInprogress = true;
      const pageSize = configuration.pageSize;
      const lastItemIndex = index * pageSize;
      if (index < $pageIndex) {
        tableData.update(() => data.slice(lastItemIndex, lastItemIndex + pageSize));
        serverFetchInprogress = false;
        $pageIndex = index;
        return;
      }
      const isDataInIndexExistsInMemory = data[lastItemIndex];
      if (isDataInIndexExistsInMemory) {
        tableData.update(() => data.slice(lastItemIndex, lastItemIndex + pageSize));
        serverFetchInprogress = false;
        $pageIndex = index;
        return;
      }
      const failure = () => {
        toast.error('Failed to fetch page data');
        serverFetchInprogress = false;
      };
      const queryParamName = configuration.serverSide.paginationQuery?.paramName; 
      const queryParamValueDataPath = configuration.serverSide.paginationQuery?.paramValueDataPath; 
      const queryParamValue = queryParamValueDataPath ? data[lastItemIndex - 1][queryParamValueDataPath] : index;
      let additionalSearchParams = '';
      if ($page.url.searchParams.size > 0) {
        additionalSearchParams = `&${$page.url.searchParams.toString()}`;
      }
      fetch(`${route}?${queryParamName ?? 'pageIndex'}=${queryParamValue}&pageSize=${pageSize}${additionalSearchParams}`, {method: 'GET'})
        .then((res) => {
          res.json().then((res) => {
            const resultDataPath = configuration.serverSide?.resultDataPath;
            const incoming = resultDataPath ? res[resultDataPath] : res;
            data.push(...incoming);
            tableData.update(() => incoming);
            serverFetchInprogress = false;
            $pageIndex = index;
          }, failure);
        }, failure);      
    }
  }

  function filterWith(filter: TableFilter<any>, value: any) {
    filters[filter.id].currentValue = value;
    if (!configuration?.serverSide && (filter.query && filter.query.paramValueDataPath)) {
      tableData.update((items => items.filter(i => i[filter.query!.paramValueDataPath!] === value)));
    } else {
      const failure = () => {
        toast.error('Failed to filter page data');
        serverFetchInprogress = false;
        filterInProgress = false;
      };
      const route = configuration.serverSide!.route;
      serverFetchInprogress = true;
      filterInProgress = true;
      const url = `${route}?pageSize=${$pageSize}&${filter.query!.paramName!}=${value}`;
      fetch(url, {method: 'GET'})
          .then((res) => {
            res.json().then((res) => {
              const resultDataPath = configuration.serverSide?.resultDataPath;
              const incoming = resultDataPath ? res[resultDataPath] : res;
              data = incoming;
              tableData.update(() => incoming);
              serverFetchInprogress = false;
              filterInProgress = false;
              addSearchParamToUrl($page.url.searchParams, filter.query!.paramName!, value);
            }, failure);
          }, failure);
    }
  }

  function onBodyRowClick(row: BodyRow<any, any>) {
    if (!configuration.clickableRows) { return; }
    dispatch('rowClicked', row.original);
  }

</script>

{#if configuration?.filters}
  <div class="flex flex-col gap-2 border rounded-md mb-2 p-2">
    <Label>Filters</Label>
    <div class="flex flex-row flex-wrap gap-2">
      {#each configuration?.filters as filter}
        {#if filter.type === 'select' && !!filter.options}
          <Select.Root
            selected={filters && filters[filter.id]?.currentValue}
            disabled={serverFetchInprogress}
            onSelectedChange={(v) => filterWith(filter, v?.value)}
          >
            <Select.Trigger>
              <div class="flex flex-row items-center gap-2">
                {#if serverFetchInprogress && filterInProgress}
                  <LoaderCircle class="animate-spin" size=14 />
                {/if}
                <Select.Value placeholder={filter.label} />
              </div>
            </Select.Trigger>
            <Select.Content>
              {#each filter.options as option}              
                <Select.Item value={option.value} label={option.label} />
              {/each}
            </Select.Content>
          </Select.Root>
        {/if}
      {/each}
    </div>
  </div>
{/if}
<div class="flex flex-row items-center gap-2 mb-2 w-full">
  {#if configuration?.search}
    <Input placeholder={configuration?.search?.placeholder ?? ''}
      disabled={serverFetchInprogress}
      on:input={debounceSearchPhrase}/>
  {/if}
  {#if configuration?.createItemButton}
    <Button variant="outline" class="flex flex-row items-center gap-2 w-fit {configuration.createItemButton.class ?? ''}"
      disabled={serverFetchInprogress || disabled || configuration.createItemButton.disabled}
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
              {#each row.cells as cell, i (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs>
                  <TableComponent.Cell {...attrs} on:click={() => i < (row.cells.length - 1) ? onBodyRowClick(row) : null}>
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
      disabled={!$hasPreviousPage || serverFetchInprogress}>Previous</Button
    >
    <Button
      variant="outline"
      size="sm"
      disabled={!$hasNextPage || serverFetchInprogress}
      on:click={() => paginateNextOrPrevious($pageIndex + 1)}>Next</Button
    >
  </div>
</div>