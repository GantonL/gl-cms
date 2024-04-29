<script lang="ts">
	import { ChevronsLeft, ChevronsRight } from "lucide-svelte";
  import Button from "../ui/button/button.svelte";
  import { Separator } from "../ui/separator";
  import { MoreNavigationItems } from "./configuration";
	import NavigationItem from "./navigation-item.svelte";
	import type { NavigationLink } from "$lib/models/navigation-link";
  export let currentPath: string;
  export let items: NavigationLink[] = [];
  let expanded = true;
</script>
<nav class="flex items-start border-r flex-col h-full gap-2 p-2">
  {#each items as navItem}
    <NavigationItem navLink={navItem} active={navItem.link === currentPath} {expanded}/>
  {/each}
  <div class="flex-grow"></div>
  <Button name="Toggle menu items labels" aria-label="Toggle menu items labels" variant="outline" class="w-full" on:click={() => expanded = !expanded} >
    {#if expanded}
      <ChevronsLeft size=16/>
    {:else}
      <ChevronsRight size=16/>
    {/if}
  </Button>
  <Separator />
  {#each MoreNavigationItems as navItem}
    <NavigationItem navLink={navItem} active={navItem.link === currentPath} {expanded}/>
  {/each}
</nav>