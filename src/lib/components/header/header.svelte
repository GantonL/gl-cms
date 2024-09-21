<script lang="ts">
  import ThemeSwitcher from "../ui/theme-switcher/theme-switcher.svelte";
	import { AppName } from "$lib/consts";
	import UserMenu from "../user-menu/user-menu.svelte";
	import { currentProject } from "$lib/client/stores";

</script>
<header class="grid grid-cols-2 w-full p-2 border-b">
  <div class="flex flex-row items-center gap-4">
    <!-- Optional brand logo -->
    <a href="/" class="text-2xl font-extrabold self-center">{$currentProject?.display_name ?? `${AppName} ${$currentProject ? `| ${$currentProject.name}` : ''}`}</a>
  </div>
  <div class="flex flex-row justify-end gap-2">
    <ThemeSwitcher />
    <UserMenu />
  </div>
</header>