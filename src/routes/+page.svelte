<script>
	import { user } from "$lib/client/stores";
  import { Button } from "$lib/components/ui/button";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import { t } from "$lib/i18n/translations";
	import { Presentation, ShieldCheck } from "lucide-svelte";
</script>
<h1 class="text-2xl">{$t('common.landing_page_title')}</h1>
<p class="text-center text-balance text-lg">{$t('common.landing_page_description')}</p>
{#if !$user?.id}
  <div class="flex flex-row gap-4 p-4">
    <a href="/login">
      <Button variant="default" size="lg"  class="flex flex-row gap-2 items-center">
        <ShieldCheck size=16/>
        <span>{$t('common.login')}</span>
      </Button>
    </a>
    <Separator orientation="vertical"/>
    <a href="/demo-request">
      <Button variant="secondary" size="lg"  class="flex flex-row gap-2 items-center">
        <Presentation size=16/>
        <span>{$t('common.request_a_demo')}</span>
      </Button>    
    </a>
  </div>
{/if}
