<script lang="ts">
  import ThemeSwitcher from "../ui/theme-switcher/theme-switcher.svelte";
	import { AppName } from "$lib/consts";
	import UserMenu from "../user-menu/user-menu.svelte";
	import { currentProject } from "$lib/client/stores";
  import { Menu, X } from 'lucide-svelte';
	import { createEventDispatcher } from "svelte";
	import Button from "../ui/button/button.svelte";
	import GlAvatar from "../gl-avatar/gl-avatar.svelte";
  const dispatch = createEventDispatcher();
  let menuOpened = false;

  function toggleMenu() {
    menuOpened = !menuOpened;
    dispatch('open', menuOpened);
  }
</script>
<header class="grid grid-cols-2 w-full p-2 border-b">
  <div class="flex flex-row items-center gap-4">
    <Button variant="ghost" size="icon" on:click={toggleMenu} class="sm:hidden">
      {#if menuOpened}
        <X size=20/>
      {:else}
        <Menu size=20/>
      {/if}
    </Button>
    {#if $currentProject && $currentProject.logo}
      <GlAvatar url={`data:image/png;base64,${$currentProject.logo}`}/>
    {/if}
    <a href={$currentProject ? `/projects/${$currentProject.id}` : '/'} class="text-2xl font-extrabold self-center text-nowrap max-sm:hidden">{$currentProject?.display_name ?? `${AppName} ${$currentProject ? `| ${$currentProject.name}` : ''}`}</a>
  </div>
  <div class="flex flex-row justify-end gap-2">
    <ThemeSwitcher />
    <UserMenu />
  </div>
</header>