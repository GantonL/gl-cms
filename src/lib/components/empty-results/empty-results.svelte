<script lang="ts">
  import { CircleOff } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";
  import { createEventDispatcher } from "svelte";
  import { type EmptyResultsConfiguration } from "$lib/models/common";

  export let configuration: EmptyResultsConfiguration;
  const dispatch = createEventDispatcher();
</script>

<div class="border rounded-md p-4 flex flex-col gap-2 items-center justify-center {configuration.class ?? ''}">
  <div class="flex flex-col gap-2 items-center justify-center text-muted-foreground">
    <svelte:component this={configuration?.icon ?? CircleOff} />
    <span>{configuration.label}</span>
  </div>
  {#if configuration?.action}
    <Button variant="secondary"
      on:click={() => configuration.action && dispatch(configuration.action.event)}>
      {configuration.action.label}
    </Button>
  {/if}
</div>