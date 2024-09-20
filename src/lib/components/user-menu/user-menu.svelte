<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import type { UserMenuItem } from "$lib/models/menu-item";
	import { Button } from "../ui/button";
	import { User, UserRoundCheck } from "lucide-svelte";
	import { LoggedInUserMenuConfiguration, LoggedOutUserMenuConfiguration } from "./configurations";
	import { user } from "$lib/client/stores";
	import { auth } from "$lib/client/auth";
	import { t } from "$lib/i18n/translations";
	  
  function onGroupItemClick(item: UserMenuItem) {
    if (item.onClick) {
      item.onClick(auth());
    }
  }
  
  $: menuItems = !$user ? LoggedOutUserMenuConfiguration : LoggedInUserMenuConfiguration;
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button name="User Menu" aria-label="User Menu" variant={$user ? 'default' : 'secondary'} builders={[builder]} size="icon">
      {#if $user}
        <span class="text-lg font-semibold">{$user.name.slice(0,1)}</span>
      {:else}
        <User size=20/>
      {/if}
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-48" align="end">
    {#if $user}
      <div class="bg-secondary/50 text-muted-foreground p-4">
        <DropdownMenu.Label class="font-normal">
          <div class="flex flex-col space-y-1">
            <p class="text-sm font-bold leading-none">{$user.name || $t('common.anonymous')}</p>
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
                {$t(groupItem.label ?? '')}
              </a>
            </DropdownMenu.Item>
          {/each}
        </DropdownMenu.Group>
      {/if}      
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>

