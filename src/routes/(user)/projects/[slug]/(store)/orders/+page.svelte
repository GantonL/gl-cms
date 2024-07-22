<script lang="ts">
	import EmptyResults from "$lib/components/empty-results/empty-results.svelte";
	import { LoaderCircle } from "lucide-svelte";
	import { emptyResultsConfiguration, tableConfiguration } from "./configurations";
		import type { StoreOrder } from "$lib/models/store";	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import DataTable from "$lib/components/data-table/data-table.svelte";
	import { page } from "$app/stores";
	import { toast } from "svelte-sonner";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";

  let orders: StoreOrder[] = [];
  let fetchingOrders = false;
  
  const getDataRoute = 'orders';
  
  onMount(() => {
    tableConfiguration.serverSide = {
      totalItems: $page.data.totalOrders,
      route: getDataRoute,
      paginationQuery: {
        paramName: 'pageAfterIndex',
        paramValueDataPath: 'created_at',
      },
      resultDataPath: 'orders',
    }
    getFirstPageOrders();
  });
    
  function getFirstPageOrders() {
    fetchingOrders = true;
    const failureMessage = 'Failed to fetch orders:';
    const failure = (error: any) => toast.error(`${failureMessage} ${error?.message || ''}`);
    let additionalSearchParams = '';
    if ($page.url.searchParams.size > 0) {
      additionalSearchParams = `&${$page.url.searchParams.toString()}`;
    }
    fetch(`${getDataRoute}?pageSize=${tableConfiguration?.pageSize}${additionalSearchParams}`, { method: 'GET' })
      .then((res) => res.json().then((res) => {
          orders = res?.orders ?? [];
          fetchingOrders = false;
        }, failure
      ),
      failure
    );
  }

  function onCreateOrder() {
    goto(`orders/new`);
  }
  function onEditOrder(order: StoreOrder) {
    goto(`orders/${order.serial_number}`);
  }
  
  
  function copy(order: StoreOrder) {
    navigator.clipboard.writeText(String(order.serial_number))
      .then(() => {
        toast.success('Coppied to clipboard')
      })
      .catch((error) => {
        toast.error('Failed to copy: ', error)
      })
  }
  function onSearch(searchPhrase: string) {
    const failureMessage = 'Clients search failed:';
    const failure = (error: any) => toast.error(`${failureMessage} ${error?.message || ''}`) 
    fetch(`${getDataRoute}?pageSize=${tableConfiguration?.pageSize}&q=${searchPhrase}&count=true`, { method: 'GET' })
      .then((res) => res.json().then((res) => {
          orders = res?.orders ?? [];
          if (tableConfiguration.serverSide) {
            tableConfiguration.serverSide.totalItems = res.totalCount;
          }
        }, failure
      ),
      failure
    );
  }

</script>
<div class="py-5">
  {#if !fetchingOrders}
    {#if orders?.length > 0}
      <DataTable data={orders} configuration={tableConfiguration} 
        on:edit={(event)=> onEditOrder(event.detail)}
        on:create={(_) => onCreateOrder()}
        on:search={(event) => onSearch(event.detail)}
        on:copy={(event) => copy(event.detail)}/>
    {:else}
      <EmptyResults configuration={emptyResultsConfiguration} on:create={onCreateOrder}/>
    {/if}
  {:else}
    <div class="flex flex-row items-center justify-center w-full">
      <LoaderCircle class="animate-spin" size=16/>
    </div>
  {/if}
</div>
