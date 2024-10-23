<script lang="ts">
	import { page } from "$app/stores";
	import { FormsMarkdowns } from "$lib/components/forms/markdowns";
	import { locale } from "$lib/i18n/translations";
	import { LoaderCircle } from "lucide-svelte";
	import { onMount, type ComponentType } from "svelte";

  let content: ComponentType;
  onMount(async () => {
    const resourceId = `${$page.data.formType}_${locale.get()}`;
    const file = FormsMarkdowns[resourceId].file;
    content = await file[FormsMarkdowns[resourceId].path].default as ComponentType;    
  })

  function onConfirmed(event: CustomEvent) {
    if (!event.detail) return;
    // Open a confirmation modal
  }
</script>
{#if content}
  <div class="prose max-w-[800px] prose-img:m-0 prose-headings:text-secondary-foreground prose-headings:text-center pe-4 text-secondary-foreground text-justify">
    <svelte:component this={content} on:confirmed={onConfirmed}></svelte:component>
  </div>
{:else}
  <LoaderCircle class="animate-spin" size=14/>
{/if}