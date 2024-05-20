<script lang="ts">
  import { page } from "$app/stores";
	import { onDestroy, onMount } from "svelte";
	import { currentProject } from "$lib/client/stores";
  import * as ToggleGroup from "$lib/components/ui/toggle-group";
	import { ProjectNavigationConfigurations } from "./configurations";
	import type { Project } from "$lib/models/project";

  onMount(() => {
    currentProject.set(project.name);
  })
  onDestroy(() => {
    currentProject.set(undefined);
  })
  $: project = $page.data.project as Project;
</script>

<ToggleGroup.Root type="single" class="border rounded-md">
  {#each ProjectNavigationConfigurations[project.type] as navMenu}
    <ToggleGroup.Item value={navMenu.value}>
      <a href={`/projects/${project.id}/${navMenu.value}`}>{navMenu.name}</a>
    </ToggleGroup.Item>  
  {/each}
</ToggleGroup.Root>
<div class="w-full">
  <slot />
</div>