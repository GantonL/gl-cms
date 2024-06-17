<script lang="ts">
  import { page } from "$app/stores";
	import { onDestroy, onMount } from "svelte";
	import { currentProject } from "$lib/client/stores";
  import * as ToggleGroup from "$lib/components/ui/toggle-group";
	import { ProjectNavigationConfigurations } from "./configurations";
	import type { Project } from "$lib/models/project";
	import { afterNavigate, goto } from "$app/navigation";
  
  let currentNavItem = '';
  afterNavigate((navigation) => {
    const pathNameSegments = navigation?.to?.url?.pathname?.split('/');
    if (!pathNameSegments?.length) { return; }
    const last = pathNameSegments[pathNameSegments.length - 1];
    if (last && last !== navigation?.to?.params?.slug) {
      currentNavItem = last;
    }
    if (!currentNavItem) {
      goto(`/projects/${project.id}/${ProjectNavigationConfigurations[project.type][0].value}`);
    }
  });

  onMount(() => {
    currentProject.set({name: project.name, type: project.type});
  })
  onDestroy(() => {
    currentProject.set(undefined);
  })
  $: project = $page.data.project as Project;
</script>

<ToggleGroup.Root type="single" class="border rounded-md" bind:value={currentNavItem}>
  {#each ProjectNavigationConfigurations[project.type] as navMenu}
    <ToggleGroup.Item value={navMenu.value}>
      <a href={`/projects/${project.id}/${navMenu.value}`}>{navMenu.name}</a>
    </ToggleGroup.Item>  
  {/each}
</ToggleGroup.Root>
<div class="w-full">
  <slot />
</div>