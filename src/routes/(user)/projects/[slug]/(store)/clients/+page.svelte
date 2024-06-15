<script lang="ts">
	import DataTable from "$lib/components/data-table/data-table.svelte";
	import type { StoreClient } from "$lib/models/store";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";
	import { emptyResultsConfiguration, tableConfiguration } from "./configurations";
	import { LoaderCircle } from "lucide-svelte";
  import EmptyResults from "$lib/components/empty-results/empty-results.svelte";
	import { page } from "$app/stores";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";

  let clients: StoreClient[] = [];
  let fetchingClients = false;
  let deleteClientOpened = false;
  let selectedClient: StoreClient;

  const getDataRoute = 'clients';
  
  onMount(() => {
    tableConfiguration.serverSide = {
      totalItems: $page.data.totalClients,
      route: getDataRoute,
      paginationQuery: {
        paramName: 'pageAfterIndex',
        paramValueDataPath: 'created_at',
      },
      resultDataPath: 'clients',
    }
    getFirstPageClients();
  });
    
  function getFirstPageClients() {
    fetchingClients = true;
    const failureMessage = 'Failed to fetch clients:';
    const failure = (error: any) => toast.error(`${failureMessage} ${error?.message || ''}`) 
    fetch(`${getDataRoute}?pageSize=${tableConfiguration?.pageSize}`, { method: 'GET' })
      .then((res) => res.json().then((res) => {
          clients = res?.clients ?? [];
          fetchingClients = false;
        }, failure
      ),
      failure
    );
  }

  function createClient() {
    
  }
  
  function onCreateClient() {
    console.log('create?');
  }

  function onDeleteClient(client: StoreClient) {
    selectedClient = client;
    deleteClientOpened = true;
  }

  function deleteClient(client: StoreClient) {
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

  function onSearch(searchPhrase: string) {
    console.log(searchPhrase);
  }

$: project = $page.data.project;
</script>
<div class="container mx-auto py-5">
  {#if !fetchingClients}
    {#if clients?.length > 0}
      <DataTable data={clients} configuration={tableConfiguration} 
        on:delete={(event)=> onDeleteClient(event.detail)} 
        on:edit={(event)=> onEditClient(event.detail)}
        on:create={(_) => onCreateClient()}
        on:search={(event) => onSearch(event.detail)}/>
    {:else}
      <EmptyResults configuration={emptyResultsConfiguration} on:create={createClient}/>
    {/if}
  {:else}
    <div class="flex flex-row items-center justify-center w-full">
      <LoaderCircle class="animate-spin" size=16/>
    </div>
  {/if}
</div>


<AlertDialog.Root bind:open={deleteClientOpened}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete client {selectedClient && selectedClient.name} and all its related data.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action class="bg-destructive text-destructive-foreground hover:bg-destructive/80" on:click={() => deleteClient(selectedClient)}>DELETE</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>