<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import ProjectCard from "$lib/components/project-card/project-card.svelte";
	import { t } from "$lib/i18n/translations";
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
            toast.success(t.get('common.project_deleted_successfuly'));
            const deletedUserIndex = projects.findIndex((u: User) => u.id === projectId);
            projects.splice(deletedUserIndex, 1);
            projects = projects;
          } else {
            toast.error(t.get('common.project_deletion_failed'));
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
 
<h1 class="text-xl">{$t('common.projects')}</h1>
<div class="flex flex-row flex-wrap items-center justify-center gap-4">
  {#if permissions?.length}
    <ProjectCard project={null} form={$page.data.form} {permissions}/>
  {/if}
  {#each projects as project}
    <ProjectCard 
      project={project} 
      inProcess={deleting[project.id]}
      {permissions}
      on:delete={(event) => deleteProject(event)}
      on:enter={(event) => selectProject(event)}
      on:navigate={(event) => window.open(event.detail, '_blank')}/>
  {/each}
</div>