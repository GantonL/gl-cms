<script lang="ts">
	import EmptyResults from "$lib/components/empty-results/empty-results.svelte";
	import { LoaderCircle } from "lucide-svelte";
	import { emptyResultsConfiguration } from "./configurations";

  let fetchingOrders = false;

  function onCreateOrder() {

  }
  
</script>
<div class="py-5">
  {#if !fetchingOrders}
    <EmptyResults configuration={emptyResultsConfiguration} on:create={onCreateOrder}/>
  {:else}
    <div class="flex flex-row items-center justify-center w-full">
      <LoaderCircle class="animate-spin" size=16/>
    </div>
  {/if}
</div>