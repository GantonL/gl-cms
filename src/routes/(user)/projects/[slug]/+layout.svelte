<script lang="ts">
  import { page } from "$app/stores";
	import { onDestroy, onMount } from "svelte";
	import { currentProject } from "$lib/client/stores";
	import type { Project } from "$lib/models/project";
  
  onMount(() => {
    currentProject.set({
      display_name: project.display_name,
      name: project.name, 
      type: project.type,
      id: project.id,
    });
  })
  onDestroy(() => {
    currentProject.set(undefined);
  })
  $: project = $page.data.project as Project;
</script>

<div class="w-full">
  <slot />
</div>