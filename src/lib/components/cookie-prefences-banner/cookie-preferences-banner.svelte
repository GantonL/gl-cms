<script lang="ts">
	import { goto } from "$app/navigation";
  import * as Card from "$lib/components/ui/card";
	import { Cookie } from "lucide-svelte";
	import Button from "../ui/button/button.svelte";
	import { CookieManagerConfiguration } from "$lib/manage-cookies/configuration";
	import { cookieSetRequest } from "$lib/manage-cookies/manager";
	import { toast } from "svelte-sonner";
	import { t } from "$lib/i18n/translations";
	import { direction } from "$lib/client/stores";
  export let open: boolean;
  export let preferences: Record<string, boolean>;

  function setCookiesPreferences(acceptAll: boolean) {
    Object.keys(preferences).forEach(key => {
      preferences[key] = acceptAll;
    });
    cookieSetRequest({[CookieManagerConfiguration['user-preference-cookie-name']]: JSON.stringify(preferences)})
    toast.success(t.get('common.cookie_preferences_saved'));
    removeBanner();
  }

  function removeBanner() {
    open = false;
    cookieSetRequest({['show-manage-cookies-banner']: JSON.stringify(undefined)})
  }
  
</script>
<div class="fixed bottom-6 {$direction === 'ltr' ? 'left-6' : 'right-6'} p-4 z-50 mr-6 max-w-[420px]" class:hidden={!open}>
  <Card.Root>
    <Card.Header>
      <Card.Title>
        <div class="flex flex-row gap-4 items-center">
          <Cookie /> {$t('common.cookie_preferences')}
        </div>
      </Card.Title>
      <Card.Description>
        <div class="text-primary">{$t('common.cookie_prefences_description')} <a href="/policies/cookies" class="underline inderline-offset-2 text-muted-foreground">{$t('common.cookie_policy')}.</a></div>
      </Card.Description>
    </Card.Header>
    <Card.Footer>
      <div class="flex flex-col gap-2">
        <div class="flex flex-row flex-wrap gap-2">
          <Button variant="default" class="flex-grow" on:click={() => setCookiesPreferences(true)}>{$t('common.accept_all_cookies')}</Button>
          <Button variant="default" class="flex-grow" on:click={() => setCookiesPreferences(false)}>{$t('common.necessary_cookies_only')}</Button>
        </div>
        <Button variant="secondary" on:click={() => {
            goto('/manage-cookies');
            open = false;
          }
        }>{$t('common.manage_preferences')}</Button>
      </div>
    </Card.Footer>
  </Card.Root>
</div>
