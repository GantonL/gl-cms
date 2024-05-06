<script lang="ts">
  import * as Card from "$lib/components/ui/card";
	import { Button } from "../ui/button";
	import { ExternalLink, Plus, Trash, Edit2 } from "lucide-svelte";
	import * as Tooltip from "../ui/tooltip"; 
  import { createEventDispatcher } from 'svelte'
	import * as Dialog from "../ui/dialog";
	import type { Project } from "$lib/models/project";
	import CreateProjectForm from "../../../routes/(user)/projects/create-project-form.svelte";
	import { UserPermissions } from "$lib/enums/permission";

  let projectDeletionDialogState = false;

  export let project: Project | null;
  export let form = undefined;
  export let inProcess = false;
  export let permissions: UserPermissions;
  const dispatch = createEventDispatcher();

  function onDelete() {
    dispatch('delete', project!.id);
    projectDeletionDialogState = false;
  }
</script>
<div class:blur-sm={inProcess}>
  <Card.Root class="w-60 h-full">
    {#if project === null}
      {#if permissions.includes(UserPermissions.CreateProject)}
        <div class="flex items-center justify-center w-full h-full">
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="ghost" class="w-full h-full"><Plus size=24/></Button>
            </Dialog.Trigger
            >
            <Dialog.Content class="sm:max-w-[425px]">
              <Dialog.Header>
                <Dialog.Title>Create project</Dialog.Title>
              </Dialog.Header>
              {#if form}
                <CreateProjectForm data={form}/>
              {/if}
            </Dialog.Content>
          </Dialog.Root>
        </div>
      {/if}
    {:else}
      <Card.Header>
        <Card.Title>{project.name}</Card.Title>
        <Card.Description></Card.Description>
      </Card.Header>
      <Card.Content>
        <p class="text-sm text-muted-foreground font-italic">Created at: {new Intl.DateTimeFormat('en-US').format(project.created_at)}</p>
      </Card.Content>
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
                    <Tooltip.Content>Delete</Tooltip.Content>
                  </Tooltip.Root>
                </Dialog.Trigger>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>Delete Project</Dialog.Title>
                  </Dialog.Header>
                  Are you sure?
                  <Dialog.Footer>
                    <Button variant="outline" on:click={() => projectDeletionDialogState = false}>CANCEL</Button>
                    <Button variant="destructive" on:click={onDelete}>DELETE</Button>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Root>
            {/if}
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Button variant="outline" size="icon" on:click={() => project && dispatch('select', project.id)}><Edit2 size=16/></Button>
              </Tooltip.Trigger>
              <Tooltip.Content>Edit</Tooltip.Content>
            </Tooltip.Root>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Button variant="outline" size="icon" on:click={() => project && dispatch('navigate', project.url)}><ExternalLink size=16/></Button>
              </Tooltip.Trigger>
              <Tooltip.Content>Open</Tooltip.Content>
            </Tooltip.Root>
          </section>
        </section>
      </Card.Footer>
    {/if}
  </Card.Root>
</div>