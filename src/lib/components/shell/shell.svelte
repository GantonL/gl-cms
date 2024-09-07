<script lang="ts">
  import Header from '../header/header.svelte';
	import Footer from '../footer/footer.svelte';
  import { onNavigate } from '$app/navigation';
  import * as Tooltip from "../ui/tooltip";
	import { Button } from '../ui/button';
	import { ArrowUp } from 'lucide-svelte';
	import NavigationMenu from '../navigation-menu/navigation-menu.svelte';
	import { writable } from 'svelte/store';
	import { direction } from '$lib/client/stores';
	import { t } from '$lib/i18n/translations';
  const mainContentScrollEvent = writable<Event>();

  export let navigationPath: string = '';
  let scrollable: HTMLElement;
  let scrolled: boolean = false;

  onNavigate((navigation) => {
    //@ts-ignore
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      //@ts-ignore
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
	  });
  });

  function onMainContentScrolled(event: Event) {
    mainContentScrollEvent.set(event);
    scrolled = scrollable?.scrollTop > 100;
  }

</script>
<div class="h-[calc(100vh-0.75rem)] overflow-hidden" dir={$direction}>
  <Header />
  <div class="flex flex-row h-[calc(100%-3.55rem)] overflow-hidden">
    <aside>
      <NavigationMenu currentPath={navigationPath} />
    </aside>
    <main class="flex flex-col items-center flex-grow relative overflow-y-auto overflow-x-hidden" bind:this={scrollable} on:scroll={(e) => onMainContentScrolled(e)}>
      <div class="flex flex-col items-center gap-8 p-4 flex-auto w-full max-w-[1200px]">
        <slot />
      </div>
      <Footer />
      <div class="bottom-16 {$direction === 'rtl' ? 'left-6' : 'right-6'} z-50" class:hidden={!scrolled} class:fixed={scrolled}>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Button variant="outline" class="rounded-full w-12 h-12" on:click={() => scrollable.scroll({ top: 0, behavior: 'smooth' })} >
              <ArrowUp />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            {$t('common.scroll_to_top')}
          </Tooltip.Content>
        </Tooltip.Root>
      </div>
    </main>
  </div>
</div>