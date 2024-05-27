<script lang="ts">
	import { page } from "$app/stores";
	import CategoryCard from "$lib/components/category-card/category-card.svelte";
	import type { StoreCategory } from "$lib/models/store";
  let deleting: Record<string, boolean> = {};

  $: categories = $page.data.categories as StoreCategory[];

  function createCategory(event: CustomEvent) {}
  function deleteCategory(event: CustomEvent) {}
  function editCategory(event: CustomEvent) {}
</script>

<div class="grid grid-cols-3 gap-4">
  <CategoryCard category={null} 
    on:create={(event) => createCategory(event)}/>
  {#each categories as category}
    <CategoryCard 
      {category} 
      inProcess={deleting[category.id]}
      on:delete={(event) => deleteCategory(event)}
      on:edit={(event) => editCategory(event)} />
  {/each}
</div>