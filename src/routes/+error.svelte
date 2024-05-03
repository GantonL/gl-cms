<script lang="ts">
	import { goto } from '$app/navigation';
  import { page } from '$app/stores';
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
            Oh no! 
            {#if $page?.status === 404}
              This page probably doesn't exist.
            {:else}
              Something went wrong.
            {/if} 
          </h1>
          <section class="text-muted-foreground">
            {#if $page?.status}
                <p>Error Code: {$page?.status}</p>
            {/if}
            {#if $page?.error?.message}
                <p>Details: {$page?.error?.message}</p>
            {/if}
          </section>
      </div>
  {/if}
</div>