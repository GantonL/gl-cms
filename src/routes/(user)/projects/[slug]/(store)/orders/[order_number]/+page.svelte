<script lang="ts">
	import { page } from "$app/stores";
	import * as Card from "$lib/components/ui/card";
  import EmptyResults from "$lib/components/empty-results/empty-results.svelte";
	import { emptyProductsResultsConfiguration } from "./configuration";
	import CreateEditOrderForm from "./create-edit-order-form.svelte";
	import { superValidate, type Infer, type SuperValidated } from "sveltekit-superforms";
	import { formSchema, type FormSchema } from "./schema";
	import { onMount } from "svelte";
	import { zod } from "sveltekit-superforms/adapters";
	import type { StoreOrder } from "$lib/models/store";
	import { toast } from "svelte-sonner";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import { Button } from "$lib/components/ui/button";
	import { LoaderCircle } from "lucide-svelte";
	import { goto } from "$app/navigation";
  
  let createEditForm: SuperValidated<Infer<FormSchema>>;
  let deleteOrderOpened = false;
  let deletionInProgress = false;
  let saveInProgress = false;

  onMount(() => {
    initializeForm();
  })

  function initializeForm() {
    superValidate(order, zod(formSchema)).then((form) => {
      createEditForm = form;
    })
  }

  function onAddProduct() {

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

  $: order = $page.data.order;
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
