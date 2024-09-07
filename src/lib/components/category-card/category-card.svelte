<script lang="ts">
	import type { StoreCategory } from "$lib/models/store";
	import { Download, Edit2, ImageOff, Plus, Trash } from "lucide-svelte";
	import { Button } from "../ui/button";
	import * as Card from "../ui/card";
	import * as Tooltip from "../ui/tooltip";
	import { createEventDispatcher } from "svelte";
	import { locale, t } from "$lib/i18n/translations";

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
      <figure class="w-full h-24 rounded-md relative">
        {#if category.image?.url}
        <a href={category.image.url} class="absolute right-1 top-1">
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button variant="outline" size="icon" class="bg-secondary/50">
                <Download size=14></Download>
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>{$t('common.download')}</Tooltip.Content>
          </Tooltip.Root>
        </a>
        <img class="rounded-md object-center object-fill h-full w-full" src={category.image.url} alt="Category">
        {:else}
          <div class="flex items-center justify-center border rounded-md h-full text-muted-foreground">
            <ImageOff size=24></ImageOff>
          </div>
        {/if}
      </figure>
      <Card.Title>{category.title}</Card.Title>
    </Card.Header>
    <Card.Content>
      <div class="flex flex-col gap-2">
        <span class="text-sm text-muted-foreground font-italic">{$t('common.created_at')}: {new Intl.DateTimeFormat($t(`common.date_format_type.${$locale}`)).format(category.created_at)}</span>
        <span class="text-sm text-muted-foreground font-italic">{$t('common.discount')}: {category.discount}%</span>
      </div>
    </Card.Content>
    <Card.Footer>
      <section class="w-full flex fex-row flex-row-reverse">
        <section class="flex flex-row gap-2">
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button variant="destructive" size="icon" class="border border-destructive" on:click={() => category && dispatch('delete', category)}><Trash size=16/></Button>
            </Tooltip.Trigger>
            <Tooltip.Content>{$t('common.delete')}</Tooltip.Content>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button variant="outline" size="icon" on:click={() => category && dispatch('edit', category)}><Edit2 size=16/></Button>
            </Tooltip.Trigger>
            <Tooltip.Content>{$t('common.edit')}</Tooltip.Content>
          </Tooltip.Root>
        </section>
      </section>
    </Card.Footer>
    {/if}
  </Card.Root>
</div>