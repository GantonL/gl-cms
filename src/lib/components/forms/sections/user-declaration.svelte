<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { t } from "$lib/i18n/translations";
	import { createEventDispatcher } from "svelte";

  export let confirmed = false;
  let firstName: string;
  let surname: string;
  let id: string;
  const dispatch = createEventDispatcher();

  function handleChange() {
    dispatch('changed', {
      value: firstName && surname && id,
      state: { firstName, surname, id }
    });
  }

</script>
<div class="flex flex-row gap-4 items-start flex-wrap p-4 w-full">
  <div class="flex flex-col gap-2">
    <label for="firstName">{$t('common.first_name')}</label>
    {#if !confirmed}
      <Input id="firstName" type="text" bind:value={firstName} on:change={handleChange}/>
    {:else}
      <span class="font-semibold">{firstName}</span>
    {/if}
  </div>
  <div class="flex flex-col gap-2">
    <label for="surname">{$t('common.surname')}</label>
    {#if !confirmed}
      <Input id="surname" type="text" bind:value={surname} on:change={handleChange}/>
    {:else}
      <span class="font-semibold">{surname}</span>
    {/if}
  </div>
  <div class="flex flex-col gap-2">
    <label for="id">{$t('common.ID')}</label>
    {#if !confirmed}
      <Input id="id" type="text" bind:value={id} on:change={handleChange}/>
    {:else}
      <span class="font-semibold">{id}</span>
    {/if}
  </div>
</div>
