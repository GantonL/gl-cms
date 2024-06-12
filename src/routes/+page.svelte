<script>
	import { user } from "$lib/client/stores";
  import { Button } from "$lib/components/ui/button";
</script>
<h1 class="text-2xl">Welcome to GL CMS</h1>
<p class="text-center text-lg">A unique content management system for your projects</p>
{#if !$user}
  <a href="/login">
    <Button variant="default" size="lg">Login</Button>
  </a>
{/if}