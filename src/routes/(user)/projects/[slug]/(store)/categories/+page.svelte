<script lang="ts">
	import { page } from "$app/stores";
	import CategoryCard from "$lib/components/category-card/category-card.svelte";
	import type { StoreCategory } from "$lib/models/store";
  import * as Dialog from "$lib/components/ui/dialog";
	import CreateEditCategoryForm from "./create-edit-category-form.svelte";
	import { superValidate, type Infer, type SuperValidated } from "sveltekit-superforms/client";
	import { zod } from "sveltekit-superforms/adapters";
	import { formSchema, type FormSchema } from "./schema";
	import { LoaderCircle } from "lucide-svelte";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";

  let deleting: Record<string, boolean> = {};
  let editCategoryOpened = false;
  let deleteCategoryOpened = false;
  let selectedCategory: StoreCategory | undefined;
  let selectedCategoryForm: SuperValidated<Infer<FormSchema>>;
  function createCategory() {
    editCategoryOpened = true;
    superValidate(zod(formSchema)).then((form) => {
      selectedCategoryForm = form;
    })
  }
  
  function onDeleteCategory(event: CustomEvent) {
    selectedCategory = categories.find((category) => category.id === event.detail);
    if (selectedCategory?.id !== event.detail) { return; };
    deleteCategoryOpened = true;
  }

  function editCategory(event: CustomEvent) {
    selectedCategory = categories.find((category) => category.id === event.detail);
    if (selectedCategory?.id !== event.detail) { return; };
    superValidate(selectedCategory, zod(formSchema)).then((form) => {
      editCategoryOpened = true;
      selectedCategoryForm = form;
    })
  }

  function deleteCategory(id?: string) {
    console.log(id)
  }

  $: categories = $page.data.categories as StoreCategory[];
</script>

<div class="grid grid-cols-3 gap-4">
  <CategoryCard category={null} 
    on:create={(_) => createCategory()}/>
  {#each categories as category}
    <CategoryCard 
      {category} 
      inProcess={deleting[category.id]}
      on:delete={(event) => onDeleteCategory(event)}
      on:edit={(event) => editCategory(event)} />
  {/each}
</div>

<Dialog.Root bind:open={editCategoryOpened}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Edit category</Dialog.Title>
    </Dialog.Header>
    {#if selectedCategoryForm}
      <CreateEditCategoryForm data={selectedCategoryForm}/>
    {:else}
      <LoaderCircle class="animate-spin"></LoaderCircle>
    {/if}
  </Dialog.Content>
</Dialog.Root>

<AlertDialog.Root bind:open={deleteCategoryOpened}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete category {selectedCategory && selectedCategory.title}.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action on:click={() => deleteCategory(selectedCategory?.id)}>Continue</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>