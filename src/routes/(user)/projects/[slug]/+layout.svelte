<script lang="ts">
  import { page } from "$app/stores";
	import { onDestroy, onMount } from "svelte";
	import { currentProject } from "$lib/client/stores";
	import type { Project } from "$lib/models/project";
  
  onMount(() => {
    currentProject.set({name: project.name, type: project.type});
  })
  onDestroy(() => {
    currentProject.set(undefined);
  })
  $: project = $page.data.project as Project;
</script>

<div class="w-full">
  <slot />
</div>