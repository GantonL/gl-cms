<script lang="ts">
	import { page } from "$app/stores";
	import * as Card from "$lib/components/ui/card";
	import CreateEditOrderForm from "./create-edit-order-form.svelte";
	import { superValidate, type Infer, type SuperValidated } from "sveltekit-superforms";
	import { formSchema, type FormSchema } from "./schema";
	import { onMount } from "svelte";
	import { zod } from "sveltekit-superforms/adapters";
	import { toast } from "svelte-sonner";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import { Button } from "$lib/components/ui/button";
	import { LoaderCircle } from "lucide-svelte";
	import { goto } from "$app/navigation";
	import type { ClinicPatient } from "$lib/models/clinic";
  import * as Tabs from "$lib/components/ui/tabs";
	import EmptyResults from "$lib/components/empty-results/empty-results.svelte";
	import DataTable from "$lib/components/data-table/data-table.svelte";
	import { emptyFilesResultsConfiguration, emptyTreatmentsResultsConfiguration, filesTableConfiguration, treatmentsHistoryTableConfiguration } from "./configurations";

  let createEditForm: SuperValidated<Infer<FormSchema>>;
  let deletePatientOpened = false;
  let deletionInProgress = false;
  let saveInProgress = false;
  
  $: patient = $page.data.patient as ClinicPatient;
  $: project = $page.data.project;

  onMount(() => {
    initializeForm();
  })

  function initializeForm() {
    superValidate(patient, zod(formSchema)).then((form) => {
      createEditForm = form;
    })
  }
  
  function onPatientUpdated(event: CustomEvent) {
    const updatedOrder = event.detail;
  }
  
  function onPatientCreated(event: CustomEvent) {
    const createdOrder = event.detail;
  }

  function deletePatient(patient: ClinicPatient) {
    if (!patient?.id) return;
    deletionInProgress = true;
    const body = new FormData();
    body.append('id', patient.id);
    const errMsg = `failed to delete patient`;
    fetch(`/projects/${project.id}/patients/${patient.id}`, { method: 'DELETE', body })
      .then((res) => {
        res?.json().then((res) => {
          if (res?.success) {
            toast.success(`Successfuly deleted patient`);
            goto(`../patients`);
          } else {
            toast.error(errMsg);
          }
          deletionInProgress = false;
        }, () => {
          toast.error(errMsg);
          deletionInProgress = false;
        });
      }, () => {
        toast.error(errMsg);
        deletionInProgress = false;
      });
  }

  function onAddTreatment() {
    
  }

  function deleteTreatment(id: string) {

  }

  function onAddFile() {

  }

  function deleteFile(path: string) {

  }

</script>
<Card.Root>
  <Card.Header>
    <Card.Title>
      <h1>
        {#if !patient.id}
          Create patient
        {:else}
          Patient #{patient.personal_id}
        {/if}
      </h1>
    </Card.Title>
  </Card.Header>
  <Card.Content>
    <div class="flex flex-col gap-4">
      <div class="flex flex-row flex-wrap gap-4">
        <Card.Root class="flex-grow">
          <Card.Header>
            <Card.Title>Details</Card.Title>
            <Card.Description>General information about this patient</Card.Description>
          </Card.Header>
          <Card.Content>
            {#if createEditForm}
              <CreateEditOrderForm 
                data={createEditForm}
                disabled={saveInProgress || deletionInProgress}
                action={patient ? 'update' : 'create'}
                on:updated={(event) => onPatientUpdated(event)}
                on:created={(event) => onPatientCreated(event)}/>
            {/if}
          </Card.Content>
        </Card.Root>
        <Card.Root class="flex-grow">
          <Card.Header>
            <Card.Title>Data</Card.Title>
            <Card.Description>Handle data related to this patient</Card.Description>
          </Card.Header>
          <Card.Content>
            <Tabs.Root value="treatments" class="w-full">
              <Tabs.List>
                <Tabs.Trigger value="treatments">Treatments</Tabs.Trigger>
                <Tabs.Trigger value="files">Files</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="treatments">
                {#if !patient.treatments_history || patient.treatments_history?.length === 0}
                  <EmptyResults configuration={emptyTreatmentsResultsConfiguration} on:create={onAddTreatment}/>
                {:else}
                  <DataTable 
                    data={patient.treatments_history}
                    configuration={treatmentsHistoryTableConfiguration} 
                    on:create={onAddTreatment}
                    on:delete={(event) => deleteTreatment(event.detail.id)}/>
                {/if}
              </Tabs.Content>
              <Tabs.Content value="files">
                {#if !patient.files || patient.files?.length === 0}
                  <EmptyResults configuration={emptyFilesResultsConfiguration} on:create={onAddFile}/>
                {:else}
                  <DataTable 
                    data={patient.files}
                    configuration={filesTableConfiguration} 
                    on:create={onAddFile}
                    on:delete={(event) => deleteFile(event.detail.path)}/>
                {/if}
              </Tabs.Content>
            </Tabs.Root>
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  </Card.Content>
</Card.Root>
{#if patient.id}
  <Card.Root class="border-destructive bg-destructive/20 mt-2">
    <Card.Header>
      <Card.Title class="text-destructive">Danger Zone</Card.Title>
    </Card.Header>
    <Card.Footer>
      <Button class="w-full flex flex-row gap-2 items-center" disabled={saveInProgress || deletionInProgress} variant='destructive'
        on:click={() => deletePatientOpened = true}>
        {#if deletionInProgress}
          <LoaderCircle class="animate-spin"></LoaderCircle>
        {/if}
        DELETE PATIENT
      </Button>
    </Card.Footer>
  </Card.Root>
{/if}

<AlertDialog.Root bind:open={deletePatientOpened}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete patient {patient.personal_id} ({patient.first_name} {patient.sur_name}) and all of its related data.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action class="bg-destructive text-destructive-foreground hover:bg-destructive/80" on:click={() => deletePatient(patient)}>DELETE</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
