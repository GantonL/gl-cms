<script lang="ts">
  import { page } from "$app/stores";
	import { onDestroy, onMount } from "svelte";
	import { currentProject } from "$lib/client/stores";
  import * as ToggleGroup from "$lib/components/ui/toggle-group";

  onMount(() => {
    currentProject.set(project.name);
  })
  onDestroy(() => {
    currentProject.set(undefined);
  })
  $: project = $page.data.project;
</script>

<ToggleGroup.Root type="single" class="border rounded-md">
  <ToggleGroup.Item value="dashboard">
    <a href={`/projects/${project.id}/dashboard`}>Dashboard</a>
  </ToggleGroup.Item>
  <ToggleGroup.Item value="content">
    <a href={`/projects/${project.id}/content`}>Content</a>
  </ToggleGroup.Item>
  <ToggleGroup.Item value="images">
    <a href={`/projects/${project.id}/images`}>Images</a>
  </ToggleGroup.Item>
  <ToggleGroup.Item value="files">
    <a href={`/projects/${project.id}/files`}>Files</a>
  </ToggleGroup.Item>
  <ToggleGroup.Item value="settings">
    <a href={`/projects/${project.id}/settings`}>Settings</a>
  </ToggleGroup.Item>
</ToggleGroup.Root>
<div class="w-full">
  <slot />
</div>