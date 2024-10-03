<script lang="ts">
	import { page } from "$app/stores";
	import * as Card from "$lib/components/ui/card";
	import CreateEditPatientForm from "./create-edit-patient-form.svelte";
	import { superValidate, type Infer,type SuperValidated } from "sveltekit-superforms";
	import { patientFormSchema, patientTreatmentFormSchema, type PatientFormSchema, type PatientTreatmentFormSchema } from "./schema";
	import { onMount } from "svelte";
	import { zod } from "sveltekit-superforms/adapters";
	import { toast } from "svelte-sonner";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import { Button } from "$lib/components/ui/button";
	import { ArrowRight, AlertTriangle, ImagePlus, LoaderCircle, Pencil, PencilOff, Pill, NotebookPen, Stethoscope, File, Image, MessageSquare } from "lucide-svelte";
	import { goto } from "$app/navigation";
	import type { ClinicPatient, ClinicTreatmentHistoryItem } from "$lib/models/clinic";
  import * as Tabs from "$lib/components/ui/tabs";
	import EmptyResults from "$lib/components/empty-results/empty-results.svelte";
	import DataTable from "$lib/components/data-table/data-table.svelte";
	import { emptyFilesResultsConfiguration, emptyImagesResultsConfiguration, emptyTreatmentsResultsConfiguration, filesTableConfiguration, treatmentsHistoryTableConfiguration } from "./configurations";
	import * as Avatar from "$lib/components/ui/avatar";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import { enhance } from "$app/forms";
	import type { ActionData } from "./$types";
	import { DateFormatter, getLocalTimeZone, parseDate, parseDateTime, today } from "@internationalized/date";
	import { Separator } from "$lib/components/ui/separator";
	import AddPatientFileForm from "./add-patient-file-form.svelte";
	import ImagesScroller from "$lib/components/images-scroller/images-scroller.svelte";
	import type { Image as PateintImage } from "$lib/models/image";
	import { ClinicStorageDirectories } from "$lib/enums/storage";
	import CreateEditPatientTreatmentForm from "./create-edit-patient-treatment-form.svelte";
	import { locale, t } from "$lib/i18n/translations";
	import type { Project } from "$lib/models/project";
	import Currency from "$lib/components/currency/currency.svelte";

  let createEditForm: SuperValidated<Infer<PatientFormSchema>>;
  let deletePatientOpened = false;
  let deletionInProgress = false;
  let saveInProgress = false;
  let avatarFileList: FileList | undefined;
  let avatarCandidate: string;
  let changeAvatarDialogOpened = false;
  let avatarInput: HTMLInputElement;
  let avatarUpdateInProgress = false;
  let editPersonlInformation = false;
  let patientDOB = '';
  let addPatientFilesDialogOpened = false;
  let patientFilesUploadInprogress = false;
  let deleteFileInProgress = false;
  let addPatientImagesDialogOpened = false;
  let patientTreatmentsHistory: ClinicTreatmentHistoryItem[] = [];
  let editCreateTreatmentDialogOpened = false;
  let updateTreatmentInProgress = false;
  let selectedTreatmentForm: SuperValidated<Infer<PatientTreatmentFormSchema>>;
  let selectedTreatment: ClinicTreatmentHistoryItem | undefined;
  let deleteTreatmentInProgress = false;
  let receivedPayments: number | undefined;
  let fetchingPaymentsHistory = false;
  let selectedPatientDataTab: string | undefined = 'treatments';
  let balanceDue: number | undefined;

  export let form: ActionData;

  $: patient = $page.data.patient as ClinicPatient;
  $: project = $page.data.project as Project;
  $: if (form) {
      switch (form?.type) {
        case 'avatar':
          if (form?.error || form?.success) {
             avatarUpdateInProgress = false;
          }
          if (form?.error) {
            toast.error(t.get(form.message));
          } else if (form.success) {
            toast.success(t.get('common.patient_avatar_updated_successfuly'));
          }
          break;
        case 'treatment': 
          updateTreatmentInProgress = false;
          editCreateTreatmentDialogOpened = false;
          const treatmentToUpdateIndex = patientTreatmentsHistory.findIndex((t) => t.id === form.form?.data?.id);
          patientTreatmentsHistory[treatmentToUpdateIndex] = {
            ...patientTreatmentsHistory[treatmentToUpdateIndex],
            ...form.form!.data,
          }
          updateTotalPayments();
          if (form?.error) {
            toast.error(t.get(form.message));
          }
          break;
        default:
          break;
      }
    
    }

  $: if (patient.date_of_birth) {
        const dateFormatter = new DateFormatter(t.get(`common.date_format_type.${locale.get()}`), { dateStyle: "long" });
        const parsedDate = parseDate(patient.date_of_birth);
        const dob = dateFormatter.format(parsedDate.toDate(getLocalTimeZone()));
        const years = today(getLocalTimeZone()).year - parsedDate.year;
        patientDOB = `${dob} (${years})`; 
  }

  onMount(() => {
    initializeForms();
    initializePatientTreatmentHistory();
  })

  function initializeForms() {
    superValidate(patient, zod(patientFormSchema)).then((form) => {
      createEditForm = form;
    });
  }

  function initializePatientTreatmentHistory() {
    if (!patient.id) { return; };
    fetchingPaymentsHistory = true;
    fetch(`/projects/${project.id}/patients/${patient.id}/treatments`, { method: 'GET' })
      .then((res) => {
        res?.json().then((res) => {
          patientTreatmentsHistory = res.treatmentsHistory;
          updateTotalPayments();
        })
        .finally(() => fetchingPaymentsHistory = false)
      .finally(() => fetchingPaymentsHistory = false)
      });
  }
    
  function onPatientCreated(event: CustomEvent) {
    goto(`../patients/${event.detail.id}`)
  }

  function deletePatient(patient: ClinicPatient) {
    if (!patient?.id) return;
    deletionInProgress = true;
    const body = new FormData();
    body.append('id', patient.id);
    const errMsg = `common.failed_to_delete_patient`;
    fetch(`/projects/${project.id}/patients/${patient.id}`, { method: 'DELETE', body })
      .then((res) => {
        res?.json().then((res) => {
          if (res?.success) {
            toast.success(t.get('common.successfuly_deleted_patient'));
            goto(`../patients`);
          } else {
            toast.error(t.get(errMsg));
          }
          deletionInProgress = false;
        }, () => {
          toast.error(t.get(errMsg));
          deletionInProgress = false;
        });
      }, () => {
        toast.error(t.get(errMsg));
        deletionInProgress = false;
      });
  }

  function onAddTreatment() {
    selectedTreatment = undefined;
    superValidate(zod(patientTreatmentFormSchema)).then((form) => {
      selectedTreatmentForm = form;
      form.data.documentation = project.settings?.clinic?.treatment_documentation_template ?? '';
      editCreateTreatmentDialogOpened = true;
    });
  }
  
  function onTreatmentAdded(newTreatment: ClinicTreatmentHistoryItem) {
    editCreateTreatmentDialogOpened = false;
    patientTreatmentsHistory.unshift(newTreatment);
    patientTreatmentsHistory = patientTreatmentsHistory.sort((a, b) => {
      const dateTimeA = a.date.concat(`T${a.time}`); 
      const dateTimeB = b.date.concat(`T${b.time}`);
      const dateTimeAComp = new Date(parseDateTime(dateTimeA).toDate(getLocalTimeZone())).getTime();
      const dateTimeBComp = new Date(parseDateTime(dateTimeB).toDate(getLocalTimeZone())).getTime();
      return dateTimeBComp - dateTimeAComp;
    });
  }

  function onEditTreatment(treatment: ClinicTreatmentHistoryItem) {
    superValidate(treatment, zod(patientTreatmentFormSchema)).then((form) => {
      selectedTreatmentForm = form;
      selectedTreatment = treatment;
      editCreateTreatmentDialogOpened = true;
    });
  }

  function deleteTreatment(id: string) {
    if (!patient.id || !id) { return; };
    deleteTreatmentInProgress = true;
    fetch(`/projects/${project.id}/patients/${patient.id}/treatments/${id}`, { method: 'DELETE' })
      .then((res) => {
        res?.json().then((res) => {
          deleteTreatmentInProgress = false;
          if (res?.success) {
            const indexToRemove = patientTreatmentsHistory.findIndex((i) => i.id === id);
            patientTreatmentsHistory.splice(indexToRemove, 1);
            patientTreatmentsHistory = patientTreatmentsHistory;
            toast.success(t.get('common.treatement_successfully_deleted'));
          } else {
            toast.error(t.get('commmon.failed_to_delete_treatment'));
          }
        })
      });
  }

  function onAddImage() {
    addPatientImagesDialogOpened = true;
  }
  
  function onImageAdded() {
    patientFilesUploadInprogress = false;
    addPatientImagesDialogOpened = false;
  }

  function onAddFile() {
    addPatientFilesDialogOpened = true;
  }

  function onFileAdded() {
    patientFilesUploadInprogress = false;
    addPatientFilesDialogOpened = false;
  }

  function deleteFile(event: CustomEvent) {
    if (!patient?.id) return;
    deleteFileInProgress = true;
    const body = new FormData();
    body.append('path', event.detail.path);
    body.append('url', event.detail.url);
    body.append('date', event.detail.date);
    const errMsg = `common.failed_to_delete_patient_file`;
    fetch(`/projects/${project.id}/patients/${patient.id}/files`, { method: 'DELETE', body })
      .then((res) => {
        res?.json().then((res) => {
          if (res?.success) {
            toast.success(t.get('common.successfuly_deleted_patient_file'));
            const indexHandler = (file: PateintImage) => file.path === event.detail.path && file.url === event.detail.url && file.date === event.detail.date;
            const mainSegment = event.detail.path.split('/')[0];
            let key: keyof Pick<ClinicPatient, 'files' | 'images'>;
            if (mainSegment === ClinicStorageDirectories.Files) {
              key = 'files'
            } else if (mainSegment === ClinicStorageDirectories.PatientsImages) {
              key = 'images'
            }
            patient[key!]?.splice(patient[key!]!.findIndex(indexHandler), 1);
            patient[key!] = patient[key!];
          } else {
            toast.error(t.get(errMsg));
          }
          deleteFileInProgress = false;
        }, () => {
          toast.error(t.get(errMsg));
          deleteFileInProgress = false;
        });
      }, () => {
        toast.error(t.get(errMsg));
        deleteFileInProgress = false;
      });
  }

  function onViewFile(event: CustomEvent) {
    window.open(event.detail.url, "_blank");
  }


  function onChangeAvatar() {
    const file = avatarFileList?.item(0); 
    file?.arrayBuffer()?.then((ab) => {
      let blob = new Blob([ab], {type: file.type});
      avatarCandidate = URL.createObjectURL(blob);
      changeAvatarDialogOpened = true;
    })
  }

  function clearAvatarInput() {
    URL.revokeObjectURL(avatarCandidate);
    avatarFileList = undefined;
    avatarInput.value = '';
  }

  function openChat() {
    if (!patient.phone) { return; }
    let link = 'https://wa.me/972';
    const phoneNumber = patient.phone.split('-').join('');
    link+=phoneNumber;
    window.open(link, '_blank');
  }

  function updateTotalPayments() {
    receivedPayments = patientTreatmentsHistory.filter(t => t.payment_status === 'received' || t.payment_status === 'partial').reduce((acc, curr) => {
      acc+=curr.paid ?? 0;
      return acc;
    }, 0)
    balanceDue = patientTreatmentsHistory.filter(t => t.payment_status === 'awaiting' || t.payment_status === 'in_process' || t.payment_status === 'partial').reduce((acc, curr) => {
      acc+=((curr.price ?? 0) - (curr.paid ?? 0));
      return acc;
    }, 0)
  }

</script>
<Card.Root>
  <Card.Header>
    <div class="flex flex-row gap-2 items-start justify-between">
      <div class="flex flex-row gap-2 items-center">
        {#if patient.id}
          <Tooltip.Root>
            <Tooltip.Trigger>
              <form id="set-avatar" method="POST" action="?/set-avatar" enctype="multipart/form-data" use:enhance>
                <label for="avatar">
                  <Avatar.Root class="border rounded-full w-24 h-24 cursor-pointer">
                    {#if avatarUpdateInProgress}
                      <div class="flex h-full w-full items-center justify-center">
                        <LoaderCircle class="animate-spin" size=24 />
                      </div>
                    {:else}
                      <Avatar.Image src={patient.avatar?.url} class="object-cover overflow-clip-margin-unset" alt="Avatar" />
                      <Avatar.Fallback><ImagePlus size=24 class="text-muted-foreground"/></Avatar.Fallback>
                    {/if}
                  </Avatar.Root>
                </label>
                <input type="file" id="avatar" name="avatar" bind:this={avatarInput} bind:files={avatarFileList} hidden on:change={onChangeAvatar} />
              </form>
            </Tooltip.Trigger>
            <Tooltip.Content>{$t('common.change_avatar')}</Tooltip.Content>
          </Tooltip.Root>
        {/if}
        <div class="flex flex-col gap-2">
          <Card.Title>
            <h1>
              {#if !patient.id}
                {$t('common.create_patient')}
              {:else}
                {patient.first_name} {patient.sur_name}
              {/if}
            </h1>
          </Card.Title>
          {#if patient.id}
            {#if patient.personal_id}
              <Card.Description>
                {patient.personal_id}
              </Card.Description>
            {/if}
          {/if}
        </div>
      </div>
      <div class="flex flex-col items-end gap-2">
        <Button variant="secondary" class="flex flex-row items-center gap-2" on:click={openChat}>
          <MessageSquare size=16/>
          <span class="hidden sm:block">{$t('common.open_chat')}</span>
        </Button>
      </div>
    </div>
  </Card.Header>
  <Card.Content>
    <div class="flex flex-col gap-4">
      <Card.Root class="flex-grow">
        <Card.Header>
          <div class="flex flex-row justify-between">
            <div class="flex flex-col gap-2">
              <Card.Title>{$t('common.details')}</Card.Title>
              <Card.Description>{$t('common.patient_details_description')}</Card.Description>
            </div>
            <Button variant={editPersonlInformation ? 'secondary' : 'default'} class="flex flex-row items-center gap-2"
              on:click={() => {editPersonlInformation = !editPersonlInformation}}>
              {#if editPersonlInformation}
                <PencilOff size=14/>
                <span>{$t('common.cancel_edit')}</span>
              {:else}
                <Pencil size=14/>
                <span>{$t('common.edit')}</span>
              {/if}
            </Button>
          </div>
        </Card.Header>
        <Card.Content>
          {#if editPersonlInformation || !patient.id}
            {#if createEditForm}
              <CreateEditPatientForm 
                data={createEditForm}
                disabled={avatarUpdateInProgress || saveInProgress || deletionInProgress}
                action={patient.id ? 'update' : 'create'}
                on:created={(event) => onPatientCreated(event)}/>
            {/if}
          {:else}
            <div class="flex flex-row flex-wrap gap-6 items-start">
              <div class="flex flex-col">
                <h3>{$t('common.email')}</h3>
                <span class="text-muted-foreground">{patient.email}</span>
              </div>
              <div class="flex flex-col">
                <h3 class="">{$t('common.address')}</h3>
                <span class="text-muted-foreground">{patient.address}</span>
              </div>
              <div class="flex flex-col">
                <h3 class="">{$t('common.phone')}</h3>
                <span class="text-muted-foreground">{patient.phone}</span>
              </div>
              <div class="flex flex-col">
                <h3 class="">{$t('common.birth_date')}</h3>
                <span class="text-muted-foreground">{patientDOB}</span>
              </div>
              <div class="flex flex-col">
                <h3 class="">{$t('common.gender')}</h3>
                <span class="text-muted-foreground">{$t(`common.${patient.gender}`)}</span>
              </div>
              <div class="flex flex-col">
                <h3 class="">{$t('common.refered_by')}</h3>
                <span class="text-muted-foreground">{patient.refered_by}</span>
              </div>
            </div>
            <Separator class="my-4"/>
            <div class="flex flex-row flex-wrap gap-6 items-start">
              <div class="flex flex-col flex-grow">
                <h3 class="flex flex-row gap-2 items-center">
                  {#if patient.medical_condition}
                    <AlertTriangle size=14 class="text-destructive"/>
                  {/if}
                  <span>{$t('common.medical_condition')}</span>
                </h3>
                <span class="text-muted-foreground">{patient.medical_condition ?? ''}</span>
              </div>
              <div class="flex flex-col flex-grow">
                <h3 class="flex flex-row gap-2 items-center">
                  {#if patient.medications}
                    <Pill size=14/>
                  {/if}
                  <span>{$t('common.medications')}</span>
                </h3>
                <span class="text-muted-foreground">{patient.medications ?? ''}</span>
              </div>
              <div class="flex flex-col flex-grow">
                <h3 class="flex flex-row gap-2 items-center">
                  {#if patient.notes}
                    <NotebookPen size=14/>
                  {/if}
                  <span>{$t('common.notes')}</span>
                </h3>
                <span class="text-muted-foreground">{patient.notes ?? ''}</span>
              </div>
            </div>
          {/if}
        </Card.Content>
      </Card.Root>
      {#if patient?.id}
        <Card.Root class="flex-grow">
          <Card.Header>
            <div class="flex flex-row items-start justify-between">
              <div class="flex flex-col gap-2">
                <Card.Title>{$t('common.data')}</Card.Title>
                <Card.Description>{$t('common.patient_data_description')}</Card.Description>
              </div>
              {#if selectedPatientDataTab === 'treatments'}
                <div class="flex flex-col gap-2 items-end">
                  <div class="py-2 px-4 flex flex-row gap-2 items-center bg-primary text-primary-foreground rounded-md">
                    <span>{$t('common.received_payments')}:</span>
                    <Currency >
                      {#if fetchingPaymentsHistory}
                        <LoaderCircle size=14 class="animate-spin space-x-2"/>
                      {:else}
                        {receivedPayments ?? 0}
                      {/if}
                    </Currency>
                  </div>
                  <div class="py-2 px-4 flex flex-row gap-2 items-center bg-destructive text-destructive-foreground rounded-md">
                    <span>{$t('common.balance_due')}:</span>
                    <Currency >
                      {#if fetchingPaymentsHistory}
                        <LoaderCircle size=14 class="animate-spin space-x-2"/>
                      {:else}
                        -{balanceDue ?? 0}
                      {/if}
                    </Currency>
                  </div>
                </div>
              {/if}
            </div>
          </Card.Header>
          <Card.Content>
            <Tabs.Root value={selectedPatientDataTab} class="w-full" onValueChange={(v) => selectedPatientDataTab = v}>
              <Tabs.List>
                <Tabs.Trigger value="treatments">
                  <div class="flex flex-row items-center gap-2">
                    <Stethoscope size=14 />
                    <span>{$t('common.treatments')}</span>
                  </div>
                </Tabs.Trigger>
                <Tabs.Trigger value="files">
                  <div class="flex flex-row items-center gap-2">
                    <File size=14 />
                    <span>{$t('common.files')}</span>
                  </div>
                </Tabs.Trigger>
                <Tabs.Trigger value="images">
                  <div class="flex flex-row items-center gap-2">
                    <Image size=14 />
                    <span>{$t('common.images')}</span>
                  </div>
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="treatments">
                {#if fetchingPaymentsHistory}
                  <LoaderCircle class="animate-spin" size=14/>
                {:else}
                  {#if patientTreatmentsHistory?.length === 0}
                    <EmptyResults configuration={emptyTreatmentsResultsConfiguration} on:create={onAddTreatment}/>
                  {:else}
                    <DataTable 
                      disabled={deleteTreatmentInProgress || deletionInProgress || saveInProgress}
                      data={patientTreatmentsHistory}
                      configuration={treatmentsHistoryTableConfiguration} 
                      on:create={onAddTreatment}
                      on:edit={(event) => onEditTreatment(event.detail)}
                      on:rowClicked={(event) => onEditTreatment(event.detail)}
                      on:delete={(event) => deleteTreatment(event.detail.id)}/>
                  {/if}
                {/if}
              </Tabs.Content>
              <Tabs.Content value="files">
                {#if !patient.files || patient.files?.length === 0}
                  <EmptyResults configuration={emptyFilesResultsConfiguration} on:create={onAddFile}/>
                {:else}
                  <DataTable 
                    disabled={deleteFileInProgress || deletionInProgress || saveInProgress || avatarUpdateInProgress || patientFilesUploadInprogress}
                    data={patient.files}
                    configuration={filesTableConfiguration} 
                    on:create={onAddFile}
                    on:view={onViewFile}
                    on:delete={deleteFile}
                    on:rowClicked={onViewFile}/>
                {/if}
              </Tabs.Content>
              <Tabs.Content value="images">
                {#if !patient.images || patient.images?.length === 0}
                  <EmptyResults configuration={emptyImagesResultsConfiguration} on:create={onAddImage}/>
                {:else}
                  <ImagesScroller images={patient.images}
                    scrollAreaClass="max-h-[600px]"
                    disabled={deleteFileInProgress || deletionInProgress || saveInProgress || avatarUpdateInProgress || patientFilesUploadInprogress}
                    on:create={onAddImage}
                    on:delete={deleteFile}/>
                {/if}
              </Tabs.Content>
            </Tabs.Root>
          </Card.Content>
        </Card.Root>
      {/if}
    </div>
  </Card.Content>
</Card.Root>
{#if patient.id}
  <Card.Root class="border-destructive bg-destructive/20 mt-2">
    <Card.Header>
      <Card.Title class="text-destructive">{$t('common.danger_zone')}</Card.Title>
    </Card.Header>
    <Card.Footer>
      <Button class="w-full flex flex-row gap-2 items-center" disabled={avatarUpdateInProgress || saveInProgress || deletionInProgress} variant='destructive'
        on:click={() => deletePatientOpened = true}>
        {#if deletionInProgress}
          <LoaderCircle class="animate-spin"></LoaderCircle>
        {/if}
        {$t('common.delete_patient').toUpperCase()}
      </Button>
    </Card.Footer>
  </Card.Root>
{/if}

<AlertDialog.Root bind:open={deletePatientOpened}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>{$t('common.confirm_dialog_title')}</AlertDialog.Title>
      <AlertDialog.Description>
        {$t('common.delete_patient_confirmation_description')}
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>{$t('common.cancel')}</AlertDialog.Cancel>
      <AlertDialog.Action class="bg-destructive text-destructive-foreground hover:bg-destructive/80" on:click={() => deletePatient(patient)}>{$t('common.delete').toUpperCase()}</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={changeAvatarDialogOpened}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>{$t('common.change_patient_avatar_confirmation')}</AlertDialog.Title>
      <AlertDialog.Description>
         <div class="flex flex-row items-center justify-center gap-4 w-full">
          <Avatar.Root class="border rounded-full cursor-pointer">
            <Avatar.Image src={patient.avatar?.url} alt="Current avatar" />
            <Avatar.Fallback><ImagePlus size=14 class="text-muted-foreground"/></Avatar.Fallback>
          </Avatar.Root>
          <ArrowRight size=24/>
          <Avatar.Root class="border rounded-full cursor-pointer">
            <Avatar.Image src={avatarCandidate} alt="new avatar candidate" />
          </Avatar.Root>
         </div>
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel on:click={clearAvatarInput}>{$t('common.no')}</AlertDialog.Cancel>
      <AlertDialog.Action type="submit" form="set-avatar" on:click={() => { avatarUpdateInProgress = true }}>{$t('common.yes')}</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={addPatientFilesDialogOpened} closeOnOutsideClick={!patientFilesUploadInprogress}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>{$t('common.add_new_file')}</AlertDialog.Title>
    </AlertDialog.Header>
    <AddPatientFileForm 
      on:inProgress={() => {patientFilesUploadInprogress = true}}
      on:created={onFileAdded}/>
  </AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={addPatientImagesDialogOpened} closeOnOutsideClick={!patientFilesUploadInprogress}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>{$t('common.add_new_iamge')}</AlertDialog.Title>
    </AlertDialog.Header>
    <AddPatientFileForm 
      action="add-image"
      on:inProgress={() => {patientFilesUploadInprogress = true}}
      on:created={onImageAdded}/>
  </AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={editCreateTreatmentDialogOpened} closeOnOutsideClick={!updateTreatmentInProgress}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>{$t('common.treatment')}</AlertDialog.Title>
    </AlertDialog.Header>
    <CreateEditPatientTreatmentForm
      disabled={avatarUpdateInProgress || saveInProgress || deletionInProgress || updateTreatmentInProgress}
      action={selectedTreatment?.id ? 'update-treatment' : 'create-treatment'}
      data={selectedTreatmentForm}
      on:inProgress={() => {updateTreatmentInProgress = true}}
      on:created={(event) => onTreatmentAdded(event.detail)}
      on:cancel={() => {editCreateTreatmentDialogOpened = false}}/>
  </AlertDialog.Content>
</AlertDialog.Root>
