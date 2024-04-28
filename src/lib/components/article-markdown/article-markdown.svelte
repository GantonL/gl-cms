<script lang="ts">
	import type { ComponentType } from "svelte";

	export let title: string;
	export let content: ComponentType;
</script>
<h1 class="text-2xl">{title}</h1>
<article class="prose text-secondary-foreground text-justify">
  <svelte:component this={content}></svelte:component>
</article>