<script lang="ts">
	import type { StoreCategory } from "$lib/models/store";
	import { Edit2, ImageOff, Plus, Trash } from "lucide-svelte";
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
      <Button variant="ghost" class="w-full h-full" on:click={() => dispatch('create')}><Plus size=24/></Button>
    {:else}
    <Card.Header>
      <div class="w-full h-24 rounded-md">
        {#if category.image?.url}
        <!-- <a href={category.image.url}>
          add download button
        </a> -->
        <img class="rounded-md object-center object-fill h-full w-full" src={category.image.url} alt="Category">
        {:else}
          <div class="flex items-center justify-center border rounded-md h-full text-muted-foreground">
            <ImageOff size=24></ImageOff>
          </div>
        {/if}
      </div>
      <Card.Title>{category.title}</Card.Title>
    </Card.Header>
    <Card.Content>
      <div class="flex flex-col gap-2">
        <span class="text-sm text-muted-foreground font-italic">Created at: {new Intl.DateTimeFormat('en-US').format(category.created_at)}</span>
        <span class="text-sm text-muted-foreground font-italic">Discount: {category.discount}%</span>
      </div>
    </Card.Content>
    <Card.Footer>
      <section class="w-full flex fex-row flex-row-reverse">
        <section class="flex flex-row gap-2">
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button variant="destructive" size="icon" class="border border-destructive" on:click={() => category && dispatch('delete', category)}><Trash size=16/></Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Delete</Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button variant="outline" size="icon" on:click={() => category && dispatch('edit', category)}><Edit2 size=16/></Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Edit</Tooltip.Content>
          </Tooltip.Root>
        </section>
      </section>
    </Card.Footer>
    {/if}
  </Card.Root>
</div>