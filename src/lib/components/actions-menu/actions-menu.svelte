<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { type ActionItem, type ActionMenuConfiguration } from "$lib/models/menu-item";
	import { createEventDispatcher } from "svelte";
	import { Button } from "../ui/button";
	
  const dispatch = createEventDispatcher();

  export let configuration: ActionMenuConfiguration<any> | undefined = undefined;

  function onGroupItemClick(item: ActionItem<any>) {
    if (!item.event) { return; }
    dispatch(item.event, configuration?.data ?? item);
  }
</script>
{#if configuration}
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
      <Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
        <span class={configuration.trigger.labelClass}>{configuration.trigger.label}</span>
        {#if configuration.trigger.icon}
          <svelte:component 
            this={configuration.trigger.icon}
            class={configuration.trigger.iconClass}>
          </svelte:component>
        {/if}
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="w-48" align="end">
      {#each configuration.items as menuItem, i (i)}
        {#if menuItem.group}
          {#if i > 0}
            <DropdownMenu.Separator />
          {/if}
          <DropdownMenu.Group>
            {#each menuItem.group as groupItem}
              <DropdownMenu.Item class={groupItem.class}>
                <button class="flex flex-row gap-2 items-center w-full" on:click={() => onGroupItemClick(groupItem)}>
                  {#if groupItem.icon}
                    <svelte:component this={groupItem.icon} size=16/>
                  {/if}
                  {groupItem.label}
                </button>
              </DropdownMenu.Item>
            {/each}
          </DropdownMenu.Group>
        {/if}      
      {/each}
    </DropdownMenu.Content>
  </DropdownMenu.Root>
 {/if}
