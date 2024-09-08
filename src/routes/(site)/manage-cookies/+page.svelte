<script>
	import { CookieManagerConfiguration } from "$lib/manage-cookies/configuration";
	import { Button } from "$lib/components/ui/button";
	import { Label } from "$lib/components/ui/label";
	import { Switch } from "$lib/components/ui/switch";
	import { page } from "$app/stores";
	import { cookieSetRequest } from "$lib/manage-cookies/manager";
  import { toast } from "svelte-sonner";
	import { t } from "$lib/i18n/translations";

  function saveChanges() {
    cookieSetRequest({[CookieManagerConfiguration['user-preference-cookie-name']]: JSON.stringify(preferences)})
    toast.success(t.get('common.preference_changes_saved'));
  }

  function rejectAll() {
    Object.keys(preferences).forEach(key => {
      preferences[key] = false;
    });
    cookieSetRequest({[CookieManagerConfiguration['user-preference-cookie-name']]: JSON.stringify(preferences)})
    toast.success(t.get('common.optional_cookies_rejected'));
  }

  $: preferences = $page.data.preferences;
</script>

<h1 class="text-2xl">{$t('common.manage_cookie_preferences')}</h1>
<article class="prose prose-xl text-justify text-secondary-foreground">{$t('common.manage_cookie_preferences_description')}</article>
<div class="flex flex-col items-center gap-6">
  {#each CookieManagerConfiguration['cookies-categories'] as cookieCategory}
    <section class="border rounded-md p-2 prose prose-xl text-justify text-secondary-foreground prose-headings:text-secondary-foreground">
      <section class="flex flex-row justify-between items-center">
        <h2 class="text-xl mt-1 capitalize">{$t(`common.${cookieCategory["name"]}`)}</h2>
        <div class="flex items-center gap-2">
          {#if cookieCategory['optional']}
            <Switch id={cookieCategory["name"]} bind:checked={preferences[cookieCategory["name"]]} />
          {:else}
            <Switch id={cookieCategory["name"]} disabled checked />
          {/if}
          <Label class="cursor-pointer" for={cookieCategory["name"]}>{$t('common.accepted')}</Label>
        </div>
      </section>
      <p>{$t(`common.${cookieCategory["name"]}_cookie_description`)}</p>
    </section>
  {/each}
  <section class="flex flex-row items-center justify-center gap-4">
    <Button variant="secondary" size="lg" on:click={saveChanges}>{$t('common.save_changes')}</Button>
    <Button variant="destructive" size="lg" on:click={rejectAll}>{$t('common.reject_all')}</Button>
  </section>
  <a href='/policies/cookies' class="text-center underline underline-offset-2">
    <span class="flex flex-row items-center gap-2">{$t('common.cookie_policy')}</span>
  </a>
</div>