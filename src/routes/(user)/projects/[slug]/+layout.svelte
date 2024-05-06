<script lang="ts">
	import { page } from "$app/stores";
	import { onDestroy, onMount } from "svelte";
	import { currentProject } from "$lib/client/stores";

  onMount(() => {
    currentProject.set(project.name);
  })
  onDestroy(() => {
    currentProject.set(undefined);
  })
  $: project = $page.data.project;
</script>

<a href={`/projects/${project.id}/content`}>Content</a>
<a href={`/projects/${project.id}/images`}>Images</a>
<a href={`/projects/${project.id}/settings`}>Settings</a>
<div class="w-full">
  <slot />
</div>