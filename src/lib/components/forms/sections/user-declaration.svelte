<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { t } from "$lib/i18n/translations";
	import { createEventDispatcher } from "svelte";

  export let confirmed = false;
  let name: string;
  let date: string;
  let id: string;
  const dispatch = createEventDispatcher();

  function handleChange() {
    dispatch('changed', {
      value: name && date && id,
      state: { name, date, id }
    });  
  }

</script>
<div class="flex flex-row gap-4 items-start flex-wrap p-4 w-full">
  <div class="flex flex-col gap-2">
    <label for="name">{$t('common.name')}</label>
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
    <label for="id">{$t('common.ID')}</label>
    {#if !confirmed}
      <Input id="id" type="text" bind:value={id} on:change={handleChange}/>
    {:else}
      <span class="font-semibold">{id}</span>
    {/if}
  </div>
</div>
