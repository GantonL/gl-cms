<script lang="ts">
	import { ChevronsLeft, ChevronsRight } from "lucide-svelte";
  import Button from "../ui/button/button.svelte";
  import { ItemsConfiguration, projectItemsConfiguration } from "./configuration";
	import NavigationItem from "./navigation-item.svelte";
	import { currentProject, direction, user } from "$lib/client/stores";
	import { ProjectType } from "$lib/enums/projects";
	import type { NavigationLink } from "$lib/models/navigation-link";
	import { onMount } from "svelte";

  export let currentPath: string;
  
  $: items = $user ? [
          ...ItemsConfiguration[$user.role].map<NavigationLink>((item) => {
            item.link = `/${item.path}`;
            return item;
          }),
          ...(projectItemsConfiguration[$currentProject?.type ?? ProjectType.None]).map<NavigationLink>((item) => {
            item.link = `/projects/${$currentProject?.id ?? 'unknown'}/${item.path}`;
            return item;
          })
        ] : 
        [];
  let expanded = false;
  const navigationMenuExpansionStorageKey = 'navigation-menu-expanded';
  onMount(() => {
    const storedExpanded = localStorage.getItem(navigationMenuExpansionStorageKey);
    if (storedExpanded === 'true') {
      expanded = true
    } else if (storedExpanded === 'false') {
      expanded = false;
    }

  })
  function toggleNavigationMenu() {
    expanded = !expanded;
    localStorage.setItem(navigationMenuExpansionStorageKey, String(expanded));
  }
</script>
{#if items.length > 0 }
  <nav class="flex items-start border-r flex-col h-full gap-2 p-2">
    {#each items as navItem}
      <NavigationItem navLink={navItem} active={navItem.link === currentPath || currentPath.includes(navItem.link)} {expanded}/>
    {/each}
    <div class="flex-grow"></div>
    <Button name="Toggle menu items labels" aria-label="Toggle menu items labels" variant="outline" class="w-full {$direction === 'rtl' ? 'rotate-180' : ''}" on:click={toggleNavigationMenu} >
      {#if expanded}
      <ChevronsLeft size=16/>
      {:else}
      <ChevronsRight size=16/>
      {/if}
    </Button>
  </nav>
{/if}