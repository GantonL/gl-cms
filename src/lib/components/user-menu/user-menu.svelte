<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import type { UserMenuItem } from "$lib/models/menu-item";
	import { Button } from "../ui/button";
	import { User, UserRoundCheck } from "lucide-svelte";
	import { LoggedInUserMenuConfiguration, LoggedOutUserMenuConfiguration } from "./configurations";
	import { user } from "$lib/client/stores";
	import { auth } from "$lib/client/auth";
	  
  function onGroupItemClick(item: UserMenuItem) {
    if (item.onClick) {
      item.onClick(auth());
    }
  }
  
  $: menuItems = !$user ? LoggedOutUserMenuConfiguration : LoggedInUserMenuConfiguration;
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button name="User Menu" aria-label="User Menu" variant="ghost" builders={[builder]} class="relative aspect-square rounded-full">
      <Avatar.Root>
        <Avatar.Image src={$user?.image} alt={$user?.name} />
        <Avatar.Fallback>
          {#if $user}
            <UserRoundCheck />
          {:else}
            <User />
          {/if}
        </Avatar.Fallback>
      </Avatar.Root>
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-48" align="end">
    {#if $user}
      <div class="bg-secondary/50 text-muted-foreground p-4">
        <DropdownMenu.Label class="font-normal">
          <div class="flex flex-col space-y-1">
            <p class="text-sm font-bold leading-none">{$user.name || 'Anonymous'}</p>
            {#if $user?.email}
              <p class="text-xs leading-none text-muted-foreground">{$user.email}</p>
            {/if}
          </div>
        </DropdownMenu.Label>
      </div>
    {/if}
    {#each menuItems as menuItem, i (i)}
      {#if menuItem.group}
        {#if i > 0}
          <DropdownMenu.Separator />
        {/if}
        <DropdownMenu.Group>
          {#each menuItem.group as groupItem}
            <DropdownMenu.Item>
              <a href={groupItem.link} class="flex flex-row gap-2 items-center w-full" on:click={() => onGroupItemClick(groupItem)}>
                {#if groupItem.icon}
                  <svelte:component this={groupItem.icon} size=16/>
                {/if}
                {groupItem.label}
              </a>
            </DropdownMenu.Item>
          {/each}
        </DropdownMenu.Group>
      {/if}      
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>

