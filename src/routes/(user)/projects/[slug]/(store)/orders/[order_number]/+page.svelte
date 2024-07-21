<script lang="ts">
	import { page } from "$app/stores";
	import * as Card from "$lib/components/ui/card";
  import EmptyResults from "$lib/components/empty-results/empty-results.svelte";
	import { emptyProductsResultsConfiguration, emptyProductsSearchResultsConfiguration } from "./configuration";
	import CreateEditOrderForm from "./create-edit-order-form.svelte";
	import { superValidate, type Infer, type SuperValidated } from "sveltekit-superforms";
	import { formSchema, type FormSchema } from "./schema";
	import { onMount } from "svelte";
	import { zod } from "sveltekit-superforms/adapters";
	import type { StoreOrder } from "$lib/models/store";
	import { toast } from "svelte-sonner";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import { Button } from "$lib/components/ui/button";
	import { LoaderCircle, MinusCircle, PlusCircle } from "lucide-svelte";
	import { goto } from "$app/navigation";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Input } from "$lib/components/ui/input";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import { Separator } from "$lib/components/ui/separator";
  
  let createEditForm: SuperValidated<Infer<FormSchema>>;
  let deleteOrderOpened = false;
  let deletionInProgress = false;
  let saveInProgress = false;
  let addProductsDalogOpened = false;
  let fetchProductsInProgress = false;
  let products: Record<string, any>[] = [];

  onMount(() => {
    initializeForm();
  })

  function initializeForm() {
    superValidate(order, zod(formSchema)).then((form) => {
      createEditForm = form;
    })
  }

  function onAddProduct() {
    addProductsDalogOpened = true;
  }

  function onOrderUpdated(event: CustomEvent) {
    const updatedOrder = event.detail;
  }
  
  function onOrderCreated(event: CustomEvent) {
    const createdOrder = event.detail;
  }

  function deleteOrder(order: StoreOrder) {
    if (!order?.id) return;
    deletionInProgress = true;
    const body = new FormData();
    body.append('id', order.id);
    const errMsg = `failed to delete order`;
    fetch(`/projects/${project.id}/orders/${order.serial_number}`, { method: 'DELETE', body })
      .then((res) => {
        res?.json().then((res) => {
          if (res?.success) {
            toast.success(`Successfuly deleted order`);
            goto(`../orders`);
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
  let debounceSearchPhraseTimer: string | number | NodeJS.Timeout | undefined;
  function debounceSearchProductsPhrase(event: InputEvent) {
    fetchProductsInProgress = true;
    clearTimeout(debounceSearchPhraseTimer);
    debounceSearchPhraseTimer = setTimeout(() => {
      fetchProducts(10, event?.target?.value);
    }, 250);
  }

  function fetchProducts(limit?: number, query?: string) {
    fetchProductsInProgress = false;
  }

  function addProductToOrder(product: Record<string, any>) {

  }

  function removeProductFromOrder(product: Record<string, any>) {

  }

  $: order = $page.data.order as StoreOrder;
  $: project = $page.data.project;
</script>
<Card.Root>
  <Card.Header>
    <Card.Title>
      <h1>
        {#if !order.serial_number}
          Create order
        {:else}
          Order #{order.serial_number}
        {/if}
      </h1>
    </Card.Title>
  </Card.Header>
  <Card.Content>
    <div class="flex flex-row flex-wrap gap-4">
      <Card.Root class=" flex-grow">
        <Card.Header>
          <Card.Title>Details</Card.Title>
          <Card.Description>General information about this order</Card.Description>
        </Card.Header>
        <Card.Content>
          {#if createEditForm}
            <CreateEditOrderForm 
              data={createEditForm} 
              disabled={saveInProgress || deletionInProgress}
              action={order ? 'update' : 'create'}
              on:updated={(event) => onOrderUpdated(event)}
              on:created={(event) => onOrderCreated(event)}/>
          {/if}
        </Card.Content>
      </Card.Root>
      <Card.Root class=" flex-grow">
        <Card.Header>
          <Card.Title>Products</Card.Title>
          <Card.Description>Handle products related to this order</Card.Description>
        </Card.Header>
        <Card.Content>
          {#if !order.items || order.items?.length === 0}
            <EmptyResults configuration={emptyProductsResultsConfiguration} on:create={onAddProduct}/>
          {:else}
            <!-- data table -->
          {/if}
        </Card.Content>
      </Card.Root>
    </div>
  </Card.Content>
</Card.Root>
{#if order.serial_number}
  <Card.Root class="border-destructive bg-destructive/20 mt-2">
    <Card.Header>
      <Card.Title class="text-destructive">Danger Zone</Card.Title>
    </Card.Header>
    <Card.Footer>
      <Button class="w-full flex flex-row gap-2 items-center" disabled={saveInProgress || deletionInProgress} variant='destructive'
        on:click={() => deleteOrderOpened = true}>
        {#if deletionInProgress}
          <LoaderCircle class="animate-spin"></LoaderCircle>
        {/if}
        DELETE ORDER
      </Button>
    </Card.Footer>
  </Card.Root>
{/if}

<AlertDialog.Root bind:open={deleteOrderOpened}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete order {order.serial_number} and all its related data.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action class="bg-destructive text-destructive-foreground hover:bg-destructive/80" on:click={() => deleteOrder(order)}>DELETE</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<Dialog.Root bind:open={addProductsDalogOpened}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Add products</Dialog.Title>
    </Dialog.Header>
    <Input placeholder="Search name or serial number" 
      on:input={debounceSearchProductsPhrase}/>
    {#if fetchProductsInProgress}
      <LoaderCircle class="animate-spin flex-grow m-auto"/>
    {:else}
      {#if products.length === 0}
        <EmptyResults configuration={emptyProductsSearchResultsConfiguration}/>
      {:else}
      <ScrollArea class="h-64 rounded-md border">
        <div class="p-4">
          <h4 class="mb-4 text-sm font-medium leading-none">Products</h4>
          {#each products as product}
            <Separator class="my-2" />
            <div class="flex flex-row items-center justify-between gap-2 w-full">
              <span class="truncate w-5/6">{product.name} | {product.serial_number}</span>
              <div class="flex flex-row gap-2 items-center">
                <Button variant="ghost" size="icon"
                  on:click={(event) => addProductToOrder(product)}>
                  <PlusCircle size=14/>
                </Button>
                <Button variant="ghost" size="icon"
                  disabled={!order.items?.find(item => item.product_id === product.id)}
                  on:click={(event) => removeProductFromOrder(product)}>
                  <MinusCircle size=14/>
                </Button>
              </div>
            </div>
          {/each}
        </div>
      </ScrollArea>
      {/if}
    {/if}
  </Dialog.Content>
</Dialog.Root>