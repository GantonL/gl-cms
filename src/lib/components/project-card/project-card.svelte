<script lang="ts">
  import * as Card from "$lib/components/ui/card";
	import { Button } from "../ui/button";
	import { Plus, Trash } from "lucide-svelte";
	import * as Tooltip from "../ui/tooltip"; 
  import { createEventDispatcher } from 'svelte'
	import * as Dialog from "../ui/dialog";
	import type { Project } from "$lib/models/project";
	import CreateProjectForm from "../../../routes/(admin)/projects/create-project-form.svelte";

  export let project: Project | null;
  export let form = undefined;
  export let inProcess = false;
  const dispatch = createEventDispatcher();
</script>
<div class:blur-sm={inProcess}>
  <Card.Root class="w-60 h-full">
    {#if project === null}
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
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Button variant="destructive" size="icon" class="border border-destructive" on:click={() => dispatch('delete', project.id)}><Trash size=16/></Button>
              </Tooltip.Trigger>
              <Tooltip.Content>Delete</Tooltip.Content>
            </Tooltip.Root>
          </section>
        </section>
      </Card.Footer>
    {/if}
  </Card.Root>
</div>