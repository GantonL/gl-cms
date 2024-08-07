<script lang="ts">
	import EmptyResults from "$lib/components/empty-results/empty-results.svelte";
	import { LoaderCircle } from "lucide-svelte";
	import { emptyResultsConfiguration, tableConfiguration } from "./configurations";
	import DataTable from "$lib/components/data-table/data-table.svelte";
	import { page } from "$app/stores";
	import { toast } from "svelte-sonner";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import type { ClinicPatient } from "$lib/models/clinic";

  let patients: ClinicPatient[] = [];
  let fetchingPatients = false;
  
  const getDataRoute = 'patients';
  
  onMount(() => {
    tableConfiguration.serverSide = {
      totalItems: $page.data.totalOrders,
      route: getDataRoute,
      paginationQuery: {
        paramName: 'pageAfterIndex',
        paramValueDataPath: 'created_at',
      },
      resultDataPath: 'patients',
    }
    getFirstPagePatients();
  });
    
  function getFirstPagePatients() {
    fetchingPatients = true;
    const failureMessage = 'Failed to fetch patients:';
    const failure = (error: any) => toast.error(`${failureMessage} ${error?.message || ''}`);
    let additionalSearchParams = '';
    if ($page.url.searchParams.size > 0) {
      additionalSearchParams = `&${$page.url.searchParams.toString()}`;
    }
    fetch(`${getDataRoute}?pageSize=${tableConfiguration?.pageSize}${additionalSearchParams}`, { method: 'GET' })
      .then((res) => res.json().then((res) => {
          patients = res?.patients ?? [];
          fetchingPatients = false;
        }, failure
      ),
      failure
    );
  }

  function onCreatePatient() {
    goto(`patients/new`);
  }
  function onEditPatient(patient: ClinicPatient) {
    goto(`patients/${patient.id}`);
  }
  
  
  function copy(patient: ClinicPatient) {
    navigator.clipboard.writeText(String(patient.id))
      .then(() => {
        toast.success('Coppied to clipboard')
      })
      .catch((error) => {
        toast.error('Failed to copy: ', error)
      })
  }

  function onSearch(searchPhrase: string) {
    const failureMessage = 'Patients search failed:';
    const failure = (error: any) => toast.error(`${failureMessage} ${error?.message || ''}`) 
    fetch(`${getDataRoute}?pageSize=${tableConfiguration?.pageSize}&q=${searchPhrase}&count=true`, { method: 'GET' })
      .then((res) => res.json().then((res) => {
          patients = res?.patients ?? [];
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
  {#if !fetchingPatients}
    {#if patients?.length > 0}
      <DataTable data={patients} configuration={tableConfiguration} 
        on:edit={(event)=> onEditPatient(event.detail)}
        on:create={(_) => onCreatePatient()}
        on:search={(event) => onSearch(event.detail)}
        on:copy={(event) => copy(event.detail)}/>
    {:else}
      <EmptyResults configuration={emptyResultsConfiguration} on:create={onCreatePatient}/>
    {/if}
  {:else}
    <div class="flex flex-row items-center justify-center w-full">
      <LoaderCircle class="animate-spin" size=16/>
    </div>
  {/if}
</div>
