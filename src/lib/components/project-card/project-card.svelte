<script lang="ts">
  import * as Card from "$lib/components/ui/card";
	import { Button } from "../ui/button";
	import { ExternalLink, Plus, Trash, DoorOpen, Pen } from "lucide-svelte";
	import * as Tooltip from "../ui/tooltip"; 
  import { createEventDispatcher, onMount } from 'svelte'
	import * as Dialog from "../ui/dialog";
	import type { Project } from "$lib/models/project";
	import CreateProjectForm from "../../../routes/(user)/projects/create-project-form.svelte";
	import { UserPermissions } from "$lib/enums/permission";
	import { locale, t } from "$lib/i18n/translations";
	import EditProjectForm from "../../../routes/(user)/projects/edit-project-form.svelte";
	import { superValidate, type Infer } from "sveltekit-superforms/client";
	import { zod } from "sveltekit-superforms/adapters";
	import { editFormSchema, type EditFormSchema } from "../../../routes/(user)/projects/schema";
	import type { SuperValidated } from "sveltekit-superforms/client";

  let projectDeletionDialogState = false;
  let editDialogOpened = false;

  export let project: Project | null;
  export let form = undefined;
  export let inProcess = false;
  export let permissions: UserPermissions;
  const dispatch = createEventDispatcher();
  let editForm: SuperValidated<Infer<EditFormSchema>>;

  onMount(() => {
    superValidate(project, zod(editFormSchema))
      .then(form => editForm = form);
  });

  function onDelete() {
    dispatch('delete', project!.id);
    projectDeletionDialogState = false;
  }

  function onProjectUpdated(updatedProject: Pick<Project, 'display_name' | 'url'>) {
    if (!project) {return;}
    project.display_name = updatedProject.display_name;
    project.url = updatedProject.url;
    editDialogOpened = false;
    superValidate(project, zod(editFormSchema))
      .then(form => editForm = form);
  }
</script>
<div class:blur-sm={inProcess}>
  <Card.Root class="w-60 h-full min-h-60 flex flex-col justify-between">
    {#if project === null}
      {#if permissions.includes(UserPermissions.CreateProject)}
      <div class="m-auto">
        <Dialog.Root>
          <Dialog.Trigger>
              <Button variant="ghost" class="w-full h-full"><Plus size=24/></Button>
            </Dialog.Trigger
            >
            <Dialog.Content class="sm:max-w-[425px]">
              <Dialog.Header>
                <Dialog.Title>{$t('common.create_project')}</Dialog.Title>
              </Dialog.Header>
              {#if form}
                <CreateProjectForm data={form}/>
              {/if}
            </Dialog.Content>
          </Dialog.Root>
        </div>
      {/if}
    {:else}
      <a href={`/projects/${project ? project.id : undefined}/`} >
        <Card.Header>
          <Card.Title>{project.display_name ?? project.name}</Card.Title>
          <Card.Description></Card.Description>
        </Card.Header>
        <Card.Content>
          <p class="text-sm text-muted-foreground font-italic">{$t('common.created_at')}: {new Intl.DateTimeFormat($t(`common.date_format_type.${$locale}`)).format(project.created_at)}</p>
        </Card.Content>
      </a>
      <Card.Footer>
        <section class="w-full flex fex-row flex-row-reverse">
          <section class="flex flex-row gap-2">
            {#if permissions.includes(UserPermissions.DeleteProject)}
              <Dialog.Root bind:open={projectDeletionDialogState}>
                <Dialog.Trigger>
                  <Tooltip.Root>
                    <Tooltip.Trigger>
                      <Button variant="destructive" size="icon" class="border border-destructive"><Trash size=16/></Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>{$t('common.delete')}</Tooltip.Content>
                  </Tooltip.Root>
                </Dialog.Trigger>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>{$t('common.delete_project')}</Dialog.Title>
                  </Dialog.Header>
                  {$t('common.are_you_sure')}
                  <Dialog.Footer>
                    <Button variant="outline" on:click={() => projectDeletionDialogState = false}>{$t('common.cancel')}</Button>
                    <Button variant="destructive" on:click={onDelete}>{$t('common.delete').toUpperCase()}</Button>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Root>
            {/if}
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Button variant="outline" size="icon" on:click={() => editDialogOpened = true}><Pen size=16/></Button>
              </Tooltip.Trigger>
              <Tooltip.Content>{$t('common.edit')}</Tooltip.Content>
            </Tooltip.Root>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Button variant="outline" size="icon" on:click={() => project && dispatch('enter', project.id)}><DoorOpen size=16/></Button>
              </Tooltip.Trigger>
              <Tooltip.Content>{$t('common.enter')}</Tooltip.Content>
            </Tooltip.Root>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Button variant="outline" size="icon" on:click={() => project && dispatch('navigate', project.url)}><ExternalLink size=16/></Button>
              </Tooltip.Trigger>
              <Tooltip.Content>{$t('common.naviagte_to') + `: ${project.url}`}</Tooltip.Content>
            </Tooltip.Root>
          </section>
        </section>
      </Card.Footer>
    {/if}
  </Card.Root>
</div>


<Dialog.Root open={editDialogOpened}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>{$t('common.edit_project')}</Dialog.Title>
    </Dialog.Header>
    {#if editForm}
      <EditProjectForm data={editForm}
        on:updated={(event) => onProjectUpdated(event.detail)}/>
    {/if}
  </Dialog.Content>
</Dialog.Root>