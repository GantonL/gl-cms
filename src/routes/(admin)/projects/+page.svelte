<script lang="ts">
	import { page } from "$app/stores";
	import ProjectCard from "$lib/components/project-card/project-card.svelte";
	import type { User } from "$lib/models/user";
	import { toast } from "svelte-sonner";

  let deleting: Record<string, boolean> = {};
  function deleteProject(event: CustomEvent) {
    const projectId = event?.detail;
    deleting[projectId] = true
    if (projectId) {
      fetch(`/projects/${projectId}`, { method: 'DELETE' }).then((res) => {
        res?.json()?.then(_ => {
          if (_.success) {
            toast.success('Project deleted successfuly');
            const deletedUserIndex = projects.findIndex((u: User) => u.id === projectId);
            projects.splice(deletedUserIndex, 1);
            projects = projects;
          } else {
            toast.error('Failed to delete project');
          }
          deleting[projectId] = false;
        }) 
      })
    }
  }
  $: projects = $page.data.projects; 
</script>
 
<h1 class="text-xl">Projects</h1>
<div class="grid grid-cols-3 gap-4">
  <ProjectCard project={null} form={$page.data.form} />
  {#each projects as project}
    <ProjectCard project={project} inProcess={deleting[project.id]} on:delete={(event) => deleteProject(event)}/>
  {/each}
</div>