<script lang="ts">
	import { goto } from '$app/navigation';
  import { page } from '$app/stores';
	import { t } from '$lib/i18n/translations';
	import { onMount } from 'svelte';

  onMount(() => {
    if ($page.status === 401) {
      goto('/login')
    }
  })
</script>
<div class="flex items-center justify-center h-80">
  {#if $page?.error}
      <div class="flex flex-col gap-4 border border-destructive/50 bg-accent/50 rounded-lg p-8">
          <h1 class="text-xl">
            {$t('common.oh_no')}
            {#if $page?.status === 404}
              {$t('common.404_error_description')}
            {:else}
              {$t('common.something_went_wrong')}
            {/if} 
          </h1>
          <section class="text-muted-foreground">
            {#if $page?.status}
                <p>{$t('common.error_code')}: {$page?.status}</p>
            {/if}
            {#if $page?.error?.message}
                <p>{$t('common.details')}: {$page?.error?.message}</p>
            {/if}
          </section>
      </div>
  {/if}
</div>