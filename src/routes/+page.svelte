<script>
	import { user } from "$lib/client/stores";
  import { Button } from "$lib/components/ui/button";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import { Presentation, ShieldCheck } from "lucide-svelte";
</script>
<h1 class="text-2xl">Welcome to GL projects</h1>
<p class="text-center text-lg">A unique management system for your GL projects</p>
<p class="text-center text-lg">Manage everything related to your projects from content to clients</p>
{#if !$user}
  <div class="flex flex-row gap-4 p-4">
    <a href="/login">
      <Button variant="default" size="lg"  class="flex flex-row gap-2 items-center">
        <ShieldCheck size=16/>
        <span>Login</span>
      </Button>
    </a>
    <Separator orientation="vertical"/>
    <a href="/demo-request">
      <Button variant="secondary" size="lg"  class="flex flex-row gap-2 items-center">
        <Presentation size=16/>
        <span>request a demo</span>
      </Button>    
    </a>
  </div>
{/if} 