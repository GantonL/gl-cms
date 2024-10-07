<script lang="ts">
  import SignaturePad from "$lib/components/signature-pad/signature-pad.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Input } from "$lib/components/ui/input";
  import { t } from "$lib/i18n/translations";
  import { FileSignature } from "lucide-svelte";
	import { createEventDispatcher } from "svelte";

  export let confirmed = false;
  let name: string;
  let date: string;
  let signature: string;
  let signDialogOpened = false;
  const dispatch = createEventDispatcher();

  function handleChange() {
    dispatch('changed', {
      value: name && date && signature,
      state: { name, date, signature }
    });  
  }

</script>
<div class="flex flex-row gap-4 items-start flex-wrap p-4 w-full">
  <div class="flex flex-col gap-2">
    <label for="name">{$t('common.patient_name')}</label>
    {#if !confirmed}
      <Input id="name" type="text" bind:value={name} on:change={handleChange}/>
    {:else}
      <span class="font-semibold">{name}</span>
    {/if}
  </div>
  <div class="flex flex-col gap-2">
    <label for="date">{$t('common.date')}</label>
    {#if !confirmed}
      <Input id="date" type="text" bind:value={date} on:change={handleChange}/>
    {:else}
      <span class="font-semibold">{date}</span>
    {/if}
  </div>
  <div class="flex flex-col gap-2">
    <label for="signature">{$t('common.signature')}</label>
    {#if !confirmed}
      {#if signature}
        <Button variant="outline" on:click={() => signDialogOpened = true}>
          <img class="w-24 aspect-video object-fill" src={signature} alt="Signature">
        </Button>
      {:else}
        <Button variant="outline" size="icon" on:click={() => signDialogOpened = true}><FileSignature size=14/></Button>
      {/if}
    {:else}
      <img class="w-24 aspect-video object-fill" src={signature} alt="Signature">
    {/if}
  </div>
</div>

<Dialog.Root bind:open={signDialogOpened}>
  <Dialog.Content>
    <SignaturePad on:confirmed={(event) => {
      signature = event.detail;
      signDialogOpened = false;
      handleChange();
    }}/>
  </Dialog.Content>
</Dialog.Root>