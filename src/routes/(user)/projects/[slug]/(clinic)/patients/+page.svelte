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
	import { t } from "$lib/i18n/translations";

  let patients: ClinicPatient[] = [];
  let fetchingPatients = false;
  let activeSearchPhrase = false;
  
  const getDataRoute = 'patients';
  
  onMount(() => {
    tableConfiguration.serverSide = {
      totalItems: $page.data.totalPatients,
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
    const failureMessage = `${t.get('common.patients_fetch_failed')}:`;
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
        toast.success(t.get('common.coppied_to_clipboard'))
      })
      .catch((error) => {
        toast.error(`${t.get('copy_failed')}: ${error}`)
      })
  }

  function onSearch(searchPhrase: string) {
    const failureMessage = `${t.get('patients_search_failed')}:`;
    const failure = (error: any) => toast.error(`${failureMessage} ${error?.message || ''}`);
    activeSearchPhrase = !!searchPhrase;
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

  function onChat(patient: ClinicPatient) {
    let link = 'https://wa.me/972';
    const phoneNumber = patient.phone.split('-').join();
    link+=phoneNumber;
    window.open(link, '_blank');
  }

</script>
<div class="py-5">
  {#if !fetchingPatients}
    {#if patients?.length > 0 || activeSearchPhrase}
      <DataTable data={patients} configuration={tableConfiguration} 
        on:edit={(event)=> onEditPatient(event.detail)}
        on:create={(_) => onCreatePatient()}
        on:search={(event) => onSearch(event.detail)}
        on:open={(event) => onChat(event.detail)}
        on:copy={(event) => copy(event.detail)}
        on:rowClicked={(event) => onEditPatient(event.detail)}/>
    {:else}
      <EmptyResults configuration={emptyResultsConfiguration} on:create={onCreatePatient}/>
    {/if}
  {:else}
    <div class="flex flex-row items-center justify-center w-full">
      <LoaderCircle class="animate-spin" size=16/>
    </div>
  {/if}
</div>
