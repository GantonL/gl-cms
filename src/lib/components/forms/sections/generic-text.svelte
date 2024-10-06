<script lang="ts">
	import { Input } from "$lib/components/ui/input";
	import { createEventDispatcher } from "svelte";

  export let confirmed = false;
  const dispatch = createEventDispatcher();
  let value = '';

  function handleChange() {
    dispatch('changed', {
      value: !!value,
      state: { value }
    });  
  }

</script>
{#if !confirmed}
  <div class="px-4">
    <Input type="text" bind:value={value} on:change={handleChange}/>
  </div>
{:else}
  <span class="font-semibold">{value}</span>
{/if}