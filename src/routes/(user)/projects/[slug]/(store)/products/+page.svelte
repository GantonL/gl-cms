<script lang="ts">
	import DataTable from "$lib/components/data-table/data-table.svelte";
	import type { StoreProduct } from "$lib/models/store";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";
	import { emptyResultsConfiguration, tableConfiguration } from "./configurations";
	import { LoaderCircle } from "lucide-svelte";
  import EmptyResults from "$lib/components/empty-results/empty-results.svelte";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";

  let products: StoreProduct[] = [];
  let fetchingProducts = false;
  
  const getDataRoute = 'products';
  
  onMount(() => {
    tableConfiguration.serverSide = {
      totalItems: $page.data.totalProducts,
      route: getDataRoute,
      paginationQuery: {
        paramName: 'pageAfterIndex',
        paramValueDataPath: 'created_at',
      },
      resultDataPath: 'products',
    }
    getFirstPageProducts();
  });
    
  function getFirstPageProducts() {
    fetchingProducts = true;
    const failureMessage = 'Failed to fetch products:';
    const failure = (error: any) => toast.error(`${failureMessage} ${error?.message || ''}`) 
    fetch(`${getDataRoute}?pageSize=${tableConfiguration?.pageSize}`, { method: 'GET' })
      .then((res) => res.json().then((res) => {
          products = res?.products ?? [];
          fetchingProducts = false;
        }, failure
      ),
      failure
    );
  }

  function onSearch(searchPhrase: string) {
    const failureMessage = 'Products search failed:';
    const failure = (error: any) => toast.error(`${failureMessage} ${error?.message || ''}`) 
    fetch(`${getDataRoute}?pageSize=${tableConfiguration?.pageSize}&q=${searchPhrase}&count=true`, { method: 'GET' })
      .then((res) => res.json().then((res) => {
          products = res?.products ?? [];
          if (tableConfiguration.serverSide) {
            tableConfiguration.serverSide.totalItems = res.totalProducts;
          }
        }, failure
      ),
      failure
    );
  }

  function onCreateProduct() {
    goto(`products/new`);
  }
  function onEditProduct(product: StoreProduct) {
    goto(`products/${product.serial_number}`);
  }

  function copy(product: StoreProduct) {
    navigator.clipboard.writeText(String(product.serial_number))
      .then(() => {
        toast.success('Coppied to clipboard')
      })
      .catch((error) => {
        toast.error('Failed to copy: ', error)
      })
  }
</script>
<div class="py-5">
  {#if !fetchingProducts}
    {#if products?.length > 0}
      <DataTable data={products} configuration={tableConfiguration} 
        on:edit={(event)=> onEditProduct(event.detail)}
        on:create={(_) => onCreateProduct()}
        on:search={(event) => onSearch(event.detail)}
        on:copy={(event) => copy(event.detail)}/>
    {:else}
      <EmptyResults configuration={emptyResultsConfiguration} on:create={onCreateProduct}/>
    {/if}
  {:else}
    <div class="flex flex-row items-center justify-center w-full">
      <LoaderCircle class="animate-spin" size=16/>
    </div>
  {/if}
</div>
