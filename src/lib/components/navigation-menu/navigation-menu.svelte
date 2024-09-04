<script lang="ts">
	import { ChevronsLeft, ChevronsRight, HeartCrack } from "lucide-svelte";
  import Button from "../ui/button/button.svelte";
  import { Separator } from "../ui/separator";
  import { MoreNavigationItems, ItemsConfiguration, projectItemsConfiguration } from "./configuration";
	import NavigationItem from "./navigation-item.svelte";
	import { currentProject, user } from "$lib/client/stores";
	import { ProjectType } from "$lib/enums/projects";
	import type { NavigationLink } from "$lib/models/navigation-link";

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

  $: moreItems = [
    ...MoreNavigationItems.map<NavigationLink>((item) => {
        item.link = `/${item.path}`;
        return item;
      }),
  ]
  
  let expanded = false;
</script>
<nav class="flex items-start border-r flex-col h-full gap-2 p-2">
  {#if items.length > 0 }
    {#each items as navItem}
      <NavigationItem navLink={navItem} active={navItem.link === currentPath || currentPath.includes(navItem.link)} {expanded}/>
    {/each}
    {:else }
    <div class="border rounded-md bg-muted text-muted-foreground flex flex-col items-center justify-center gap-2 p-2 w-full">
      <HeartCrack />
      <span class="prose prose-sm text-center max-w-24 text-muted-foreground">Menu is not available</span>
    </div>
    {/if}
    <div class="flex-grow"></div>
    {#each moreItems as navItem}
    <Separator />
    <NavigationItem navLink={navItem} active={navItem.link === currentPath} {expanded}/>
    {/each}
    <Button name="Toggle menu items labels" aria-label="Toggle menu items labels" variant="outline" class="w-full" on:click={() => expanded = !expanded} >
      {#if expanded}
        <ChevronsLeft size=16/>
      {:else}
        <ChevronsRight size=16/>
      {/if}
    </Button>
  </nav>