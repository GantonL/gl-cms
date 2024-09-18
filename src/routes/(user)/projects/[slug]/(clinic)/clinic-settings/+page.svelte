<script lang="ts">
	import { t } from "$lib/i18n/translations";
	import { NotebookText, LoaderCircle, Stethoscope, X } from "lucide-svelte";
  import * as Card from "$lib/components/ui/card";
	import Textarea from "$lib/components/ui/textarea/textarea.svelte";
	import { page } from "$app/stores";
	import Button from "$lib/components/ui/button/button.svelte";
  import { Badge } from "$lib/components/ui/badge";
	import type { ClinicSettings } from "$lib/models/clinic";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Input } from "$lib/components/ui/input";

  let updateInProgress = false;
  let updateTemplateInProgress = false;
  let createTypeInProgress = false;
  let deleteTypeInProgress = false;
  let createTreatmentTypeOpened = false;
  let newTreatmentTypeCandidate = '';

  const settings: ClinicSettings = $page.data?.settings ?? {};

  async function updateSettings(property: keyof ClinicSettings) {
    updateInProgress = true;
    const body = new FormData();
    body.set('settings', JSON.stringify({ [property]: settings[property] }))
    const res = await fetch(`/projects/${$page.data.project.id}/clinic-settings`, {method: 'POST', body});
    updateInProgress = false;
    return res;
  }

  function saveTreatmentDocumentationTemplate() {
    updateTemplateInProgress = true;
    updateSettings('treatment_documentation_template')
      .then((res) => {
        updateTemplateInProgress = false;
      });
  }

  function deleteTreatmentType(index: number) {
    if (deleteTypeInProgress || updateInProgress || createTypeInProgress) { return; }
    deleteTypeInProgress = true;
    settings.treatments_types!.splice(index, 1);
    updateSettings('treatments_types')
      .then((res) => {
        res.json().then((res) => {
          if (res.success) {
            settings.treatments_types = settings.treatments_types
          }
        })
        .finally(() => {
          deleteTypeInProgress = false;
        });
      });
  }

  function onCreateNewType() {
    createTreatmentTypeOpened = false;
    if (!newTreatmentTypeCandidate || newTreatmentTypeCandidate?.length === 0) { return; }
    createTypeInProgress = true;
    if (!settings?.treatments_types || settings.treatments_types?.length === 0) {
      settings.treatments_types = [];
    }
    settings.treatments_types.push({ name: newTreatmentTypeCandidate });
    updateSettings('treatments_types')
    .then((res) => {
        res.json().then((res) => {
          if (res.success) {
            settings.treatments_types = settings.treatments_types
          }
        })
      })
      .finally(() => {
        createTypeInProgress = false;
        newTreatmentTypeCandidate = '';
      });
  }
</script>

<h1>{$t('common.clinic_settings')}</h1>
<div class="flex flex-row flex-wrap gap-4 mt-4">
  <div class="min-w-60 flex-grow">
		<Card.Root>
      <Card.Header>
        <Card.Title>
          <div class="flex flex-row gap-2 items-center">
            <NotebookText size=18/>
            <span>{$t('common.treatment_documentation_template')}</span>
          </div>
        </Card.Title>
        <Card.Description>{$t('common.treatment_documentation_template_description')}</Card.Description>
      </Card.Header>
      <div class="px-6 pb-6 flex flex-col gap-2">
        <Textarea class="min-h-60" bind:value={settings.treatment_documentation_template} disabled={updateInProgress}/>
        <Button class="w-fit flex flex-row items-center gap-2"
          on:click={saveTreatmentDocumentationTemplate}
          disabled={updateInProgress}>
          {#if updateTemplateInProgress}
            <LoaderCircle size=16 class="animate-spin"/>
          {/if}
          <span>{$t('common.save_changes')}</span>
        </Button>
      </div>
    </Card.Root>
	</div>
  <div class="flex-grow">
		<Card.Root>
      <Card.Header>
        <Card.Title>
          <div class="flex flex-row gap-2 items-center">
            <Stethoscope size=18/>
            <span>{$t('common.treatments_types')}</span>
          </div>
        </Card.Title>
        <Card.Description>{$t('common.treatments_types_description')}</Card.Description>
      </Card.Header>
      <div class="px-6 pb-6 flex flex-col gap-4">
        <div class="flex flex-row flex-wrap gap-2">
          {#each settings?.treatments_types ?? [] as type, i}
            <Badge variant="secondary">
              <div class="flex flex-row gap-2 items-center">
                <a href=" " on:click={() => deleteTreatmentType(i)}><X size=14/></a>
                <span>{type.name}</span>
              </div>
            </Badge>
          {/each}
        </div>
        <Button class="w-fit flex flex-row items-center gap-2"
          on:click={() => createTreatmentTypeOpened = true}
          disabled={updateInProgress}>
          {#if createTypeInProgress}
            <LoaderCircle size=16 class="animate-spin"/>
          {/if}
          <span>{$t('common.create')}</span>
        </Button>
      </div>
    </Card.Root>
	</div>
</div>

<Dialog.Root bind:open={createTreatmentTypeOpened}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{$t('common.create_treatment_type')}</Dialog.Title>
    </Dialog.Header>
    <div class="flex flex-col items-center justify-center p-6 gap-4">
      <Input class="max-w-44" type="text" bind:value={newTreatmentTypeCandidate}/>
      <div class="flex flex-row items-center gap-4">
        <Button class="w-fit flex flex-row items-center gap-2"
          on:click={onCreateNewType}>
          <span>{$t('common.create')}</span>
        </Button>
        <Button variant="secondary" class="w-fit flex flex-row items-center gap-2"
          on:click={() => createTreatmentTypeOpened = false}>
          <span>{$t('common.cancel')}</span>
        </Button>
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>