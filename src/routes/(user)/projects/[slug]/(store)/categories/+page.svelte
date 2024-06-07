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
  import { toast } from "svelte-sonner";

  let deleting: Record<string, boolean> = {};
  let editCategoryOpened = false;
  let deleteCategoryOpened = false;
  let selectedCategory: StoreCategory | undefined;
  let selectedCategoryForm: SuperValidated<Infer<FormSchema>>;
  function createCategory() {
    selectedCategory = undefined;
    superValidate(zod(formSchema)).then((form) => {
      selectedCategoryForm = form;
      editCategoryOpened = true;
    })
  }
    
  function onDeleteCategory(event: CustomEvent) {
    selectedCategory = event.detail;
    deleteCategoryOpened = true;
  }

  function editCategory(event: CustomEvent) {
    selectedCategory = event.detail;
    superValidate(selectedCategory, zod(formSchema)).then((form) => {
      selectedCategoryForm = form;
      editCategoryOpened = true;
    })
  }

  function deleteCategory(id?: string) {
    if (!id) return;
    const body = new FormData();
    body.append('project', JSON.stringify(project));
    body.append('id', id);
    fetch(`/projects/${project.id}/categories`, { method: 'DELETE', body })
      .then((res) => {
        res?.json().then((res) => {
          if (res?.success) {
            toast.success('Successfuly deleted category');
            const categoryIndex = categories.findIndex(c => c.id === id);
            categories.splice(categoryIndex, 1);
            categories = categories;
          } else {
            toast.error('failed to delete category')
          }
        }, () => {
          toast.error('failed to delete category')
        });
      }, () => {
        toast.error('failed to delete category')
      });
  }

  $: project = $page.data.project;
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
      <Dialog.Title>{selectedCategory ? 'Edit' : 'Create'} category</Dialog.Title>
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
      <AlertDialog.Action class="bg-destructive text-destructive-foreground hover:bg-destructive/80" on:click={() => deleteCategory(selectedCategory?.id)}>DELETE</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>