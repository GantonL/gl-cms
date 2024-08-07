<script lang="ts">
	import { page } from "$app/stores";
	import * as Card from "$lib/components/ui/card";
	import { onMount } from "svelte";
	import type { StoreProduct } from "$lib/models/store";
	import { toast } from "svelte-sonner";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import { Button } from "$lib/components/ui/button";
	import { LoaderCircle } from "lucide-svelte";
	import { goto } from "$app/navigation";
  import EmptyResults from "$lib/components/empty-results/empty-results.svelte";
  import { emptyImagesConfiguration, emptyVariantsConfiguration } from './configuration';

  let deleteProductOpened = false;
  let deletionInProgress = false;
  let saveInProgress = false;

  onMount(() => {

  })

  function deleteProduct(product: StoreProduct) {
    if (!product?.id) return;
    deletionInProgress = true;
    const body = new FormData();
    body.append('id', product.id);
    const errMsg = `failed to delete product`;
    fetch(`/projects/${project.id}/products/${product.serial_number}`, { method: 'DELETE', body })
      .then((res) => {
        res?.json().then((res) => {
          if (res?.success) {
            toast.success(`Successfuly deleted product`);
            goto(`../products`);
          } else {
            toast.error(errMsg);
          }
          deletionInProgress = false;
        }, () => {
          toast.error(errMsg);
          deletionInProgress = false;
        });
      }, () => {
        toast.error(errMsg);
        deletionInProgress = false;
      });
  }

  function onAddImage() {

  }

  function onAddVariant() {
    
  }


  $: product = $page.data.product as StoreProduct;
  $: project = $page.data.project;
</script>
<Card.Root>
  <Card.Header>
    <Card.Title>
      <h1>
        {#if !product?.serial_number}
          Create product
        {:else}
          Product #{product.serial_number}
        {/if}
      </h1>
    </Card.Title>
  </Card.Header>
  <Card.Content>
    <div class="flex flex-row flex-wrap gap-4">
      <Card.Root class=" flex-grow">
        <Card.Header>
          <Card.Title>Details</Card.Title>
          <Card.Description>General information about this product</Card.Description>
        </Card.Header>
        <Card.Content>
          
        </Card.Content>
      </Card.Root>
      <Card.Root class=" flex-grow">
        <Card.Header>
          <Card.Title>Images</Card.Title>
          <Card.Description>Handle images related to this product</Card.Description>
        </Card.Header>
        <Card.Content>
          {#if !product.images || product.images?.length === 0}
            <EmptyResults configuration={emptyImagesConfiguration} on:create={onAddImage}/>
          {:else}
            <!-- data table -->
          {/if}
        </Card.Content>
      </Card.Root>
    </div>
    <div class="flex flex-row flex-wrap gap-4 mt-4">
      <Card.Root class=" flex-grow">
        <Card.Header>
          <Card.Title>Variants</Card.Title>
          <Card.Description>Handle variants related to this product</Card.Description>
        </Card.Header>
        <Card.Content>
          {#if !product.variants || product.variants?.length === 0}
            <EmptyResults configuration={emptyVariantsConfiguration} on:create={onAddVariant}/>
          {:else}
            <!-- data table -->
          {/if}
        </Card.Content>
      </Card.Root>
    </div>
  </Card.Content>
</Card.Root>
{#if product?.serial_number}
  <Card.Root class="border-destructive bg-destructive/20 mt-2">
    <Card.Header>
      <Card.Title class="text-destructive">Danger Zone</Card.Title>
    </Card.Header>
    <Card.Footer>
      <Button class="w-full flex flex-row gap-2 items-center" disabled={saveInProgress || deletionInProgress} variant='destructive'
        on:click={() => deleteProductOpened = true}>
        {#if deletionInProgress}
          <LoaderCircle class="animate-spin"></LoaderCircle>
        {/if}
        DELETE PRODUCT
      </Button>
    </Card.Footer>
  </Card.Root>
{/if}

<AlertDialog.Root bind:open={deleteProductOpened}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete product {product.serial_number} and all of its related data.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action class="bg-destructive text-destructive-foreground hover:bg-destructive/80" on:click={() => deleteProduct(product)}>DELETE</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
