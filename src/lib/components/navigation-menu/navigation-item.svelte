<script lang="ts">
	import { goto } from "$app/navigation";
	import { t } from "$lib/i18n/translations";
	import type { NavigationLink } from "$lib/models/navigation-link";
	import * as Tooltip from "../ui/tooltip";

  export let navLink: NavigationLink;
  export let active: boolean;
  export let expanded: boolean;

</script>
<Tooltip.Root>
  <Tooltip.Trigger class="w-full">
    <a href={navLink.link} class="flex flex-row items-center gap-2 rounded-md px-4 py-2 hover:bg-secondary w-full" 
      class:bg-primary-foreground={!active} class:bg-secondary={active}
      on:click={() => goto(navLink.link)}>
      {#if navLink.icon}
        <svelte:component this={navLink.icon} size=16/>
      {/if}
      <span class:hidden={!expanded} class="leading-none">{$t(navLink.label)}</span>
    </a>
  </Tooltip.Trigger>
  <Tooltip.Content>
    {#if !expanded}
      {$t(navLink.label)}
    {/if}
  </Tooltip.Content>
</Tooltip.Root>