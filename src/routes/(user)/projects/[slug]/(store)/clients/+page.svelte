<script lang="ts">
	import DataTable from "$lib/components/data-table/data-table.svelte";
	import type { StoreClient } from "$lib/models/store";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";
	import { emptyResultsConfiguration, tableConfiguration } from "./configurations";
	import { LoaderCircle } from "lucide-svelte";
  import EmptyResults from "$lib/components/empty-results/empty-results.svelte";
	import { page } from "$app/stores";

  let clients: StoreClient[] = [];
  let fetchingClients = false;
  onMount(() => {
    getClients();
  });
    
  function getClients(page: number = 1) {
    fetchingClients = true;
    const failureMessage = 'Failed to fetch clients:';
    fetch(`clients?page=${page}`, { method: 'GET' })
      .then((res) => res.json().then((res) => {
        clients = res?.clients ?? [];
        fetchingClients = false;
      }, error => toast.error(`${failureMessage} ${error?.message || ''}`)), 
      error => toast.error(`${failureMessage} ${error?.message || ''}`));
  }

  function createClient() {
    
  }

  function onDeleteClient(client: StoreClient) {
    if (!client?.id) return;
    const body = new FormData();
    body.append('id', client.id);
    const errMsg = `failed to delete client ${client.name}`;
    fetch(`/projects/${project.id}/clients`, { method: 'DELETE', body })
      .then((res) => {
        res?.json().then((res) => {
          if (res?.success) {
            toast.success(`Successfuly deleted client ${client.name}`);
          } else {
            toast.error(errMsg);
          }
        }, () => {
          toast.error(errMsg);
        });
      }, () => {
        toast.error(errMsg);
      });
  }

  function onEditClient(client: StoreClient) {

  }

$: project = $page.data.project;
</script>
<div class="container mx-auto py-10">
  {#if !fetchingClients}
    {#if clients?.length > 0}
      <DataTable data={clients} configuration={tableConfiguration} 
        on:delete={(event)=> onDeleteClient(event.detail)} 
        on:edit={(event)=> onEditClient(event.detail)}/>
    {:else}
      <EmptyResults configuration={emptyResultsConfiguration} on:create={createClient}/>
    {/if}
  {:else}
    <div class="flex flex-row items-center justify-center w-full">
      <LoaderCircle class="animate-spin" size=16/>
    </div>
  {/if}
</div>