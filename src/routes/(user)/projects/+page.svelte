<script lang="ts">
	import { goto } from "$app/navigation";
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

  function selectProject(event: CustomEvent) {
    goto(`/projects/${event.detail}`);
  }
  $: projects = $page.data.projects;
  $: permissions = $page.data.permissions;
</script>
 
<h1 class="text-xl">Projects</h1>
<div class="grid grid-cols-3 gap-4">
  <ProjectCard project={null} form={$page.data.form} {permissions}/>
  {#each projects as project}
    <ProjectCard 
      project={project} 
      inProcess={deleting[project.id]}
      {permissions}
      on:delete={(event) => deleteProject(event)}
      on:select={(event) => selectProject(event)}
      on:navigate={(event) => window.open(event.detail, '_blank')}/>
  {/each}
</div>