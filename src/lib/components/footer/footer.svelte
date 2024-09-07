<script>
	import { AppName } from "$lib/consts";
	import { t } from "$lib/i18n/translations";
	import { PoliciesLinksConfiguration } from "./configurations";

</script>
<footer class="flex flex-col items-center w-full text-secondary-foreground/50 bg-secondary/50">
  <div class="flex flex-col items-center w-full gap-4 p-12">
    <section class="text-center">{$t('common.copyright')} &#169; {new Date().getFullYear()} {AppName}, {$t('common.all_rights_reserved')}.</section>
    <section class="flex flex-row flex-wrap items-center justify-center gap-2">
      {#each PoliciesLinksConfiguration as link, i (i)}
        <a href={link.link} class="text-center underline underline-offset-2">
          <span class="flex flex-row items-center gap-2">
            {#if link.icon}
              <svelte:component this={link.icon} size=16/>
            {/if}
            {$t(link.label)}
          </span>
        </a>
        {#if i < PoliciesLinksConfiguration.length - 1}
          <span>|</span>
        {/if}
      {/each}
    </section>
  </div>
  <section class="text-center">{$t('common.designed_and_built_by')}</section>
</footer>