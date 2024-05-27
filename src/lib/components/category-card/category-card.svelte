<script lang="ts">
	import type { StoreCategory } from "$lib/models/store";
	import { Edit2, Plus, Trash } from "lucide-svelte";
	import { Button } from "../ui/button";
	import * as Card from "../ui/card";
	import * as Tooltip from "../ui/tooltip";
	import { createEventDispatcher } from "svelte";

  export let category: StoreCategory | null;
  export let inProcess = false;
  const dispatch = createEventDispatcher();
</script>
<div class:blur-sm={inProcess}>
  <Card.Root class="w-60 h-full min-h-60">
    {#if category === null}
      <Button variant="ghost" class="w-full h-full" on:click={() => category && dispatch('create')}><Plus size=24/></Button>
    {:else}
    <Card.Header>
      <Card.Title>{category.title}</Card.Title>
    </Card.Header>
    <Card.Content>
      <p class="text-sm text-muted-foreground font-italic">Created at: {new Intl.DateTimeFormat('en-US').format(category.created_at)}</p>
    </Card.Content>
    <Card.Footer>
      <section class="w-full flex fex-row flex-row-reverse">
        <section class="flex flex-row gap-2">
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button variant="destructive" size="icon" class="border border-destructive" on:click={() => category && dispatch('delete', category.id)}><Trash size=16/></Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Delete</Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button variant="outline" size="icon" on:click={() => category && dispatch('edit', category.id)}><Edit2 size=16/></Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Edit</Tooltip.Content>
          </Tooltip.Root>
        </section>
      </section>
    </Card.Footer>
    {/if}
  </Card.Root>
</div>