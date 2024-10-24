<script lang="ts">
	import { page } from "$app/stores";
	import { FormsMarkdowns } from "$lib/components/forms/markdowns";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Dialog from "$lib/components/ui/dialog";
	import { locale, t } from "$lib/i18n/translations";
	import { LoaderCircle } from "lucide-svelte";
	import { onMount, type ComponentType } from "svelte";

  let content: ComponentType;
  let confirmationDialogOpened = false;
  let confirmed = false;

  $:formType = $page.data.formType;
  $:projectId = $page.data.projectId;
  $:userId = $page.data.userId;

  onMount(async () => {
    const resourceId = `${$page.data.formType}_${locale.get()}`;
    const file = FormsMarkdowns[resourceId].file;
    content = await file[FormsMarkdowns[resourceId].path].default as ComponentType;    
  })

  function onConfirmed(event: CustomEvent) {
    if (!event.detail) return;
    confirmed = true;
    confirmationDialogOpened = true;
  }

  function onSave() {

  }

  function showPreview() {

  }

  function onEdit() {
    confirmed = false;
  }
</script>
{#if content}
  <div id={formType} class="prose max-w-[800px] prose-img:m-0 prose-headings:text-secondary-foreground prose-headings:text-center pe-4 text-secondary-foreground text-justify">
    <svelte:component this={content} bind:confirmed on:confirmed={onConfirmed}></svelte:component>
  </div>
  {#if confirmed}
    <Button variant="secondary" class="w-full max-w-[800px]" on:click={onEdit}>{$t('common.edit')}</Button>
  {/if}
{:else}
  <LoaderCircle class="animate-spin" size=14/>
{/if}

<Dialog.Root bind:open={confirmationDialogOpened}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{$t('common.form_completed')}</Dialog.Title>
      <Dialog.Description>
        {$t('common.form_sign_confirm_description')}
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <div class="flex flex-row items-center gap-2">
        <Button variant="outline" on:click={() => confirmationDialogOpened = false}>{$t('common.cancel')}</Button>
        <Button variant="secondary" on:click={showPreview}>{$t('common.preview')}</Button>
        <Button on:click={onSave}>{$t('common.save')}</Button>
      </div>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>