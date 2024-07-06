<script lang="ts">
	import EmptyResults from "$lib/components/empty-results/empty-results.svelte";
	import { LoaderCircle } from "lucide-svelte";
	import { emptyResultsConfiguration, tableConfiguration } from "./configurations";
	import CreateEditOrderForm from "./create-edit-order-form.svelte";
	import * as Dialog from "$lib/components/ui/dialog";
	import type { StoreOrder } from "$lib/models/store";
	import { superValidate, type Infer, type SuperValidated } from "sveltekit-superforms";
	import { zod } from "sveltekit-superforms/adapters";
	import { formSchema, type FormSchema } from "./schema";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import DataTable from "$lib/components/data-table/data-table.svelte";
	import { page } from "$app/stores";
	import { toast } from "svelte-sonner";
	import { onMount } from "svelte";

  let orders: StoreOrder[] = [];
  let fetchingOrders = false;
  let editOrderOpened = false;
  let deleteOrderOpened = false;
  let selectedOrder: StoreOrder | undefined;
  let selectedOrderForm: SuperValidated<Infer<FormSchema>>;

  const getDataRoute = 'orders';
  
  onMount(() => {
    tableConfiguration.serverSide = {
      totalItems: $page.data.totalOrders,
      route: getDataRoute,
      paginationQuery: {
        paramName: 'pageAfterIndex',
        paramValueDataPath: 'created_at',
      },
      resultDataPath: 'orders',
    }
    getFirstPageOrders();
  });
    
  function getFirstPageOrders() {
    fetchingOrders = true;
    const failureMessage = 'Failed to fetch orders:';
    const failure = (error: any) => toast.error(`${failureMessage} ${error?.message || ''}`) 
    fetch(`${getDataRoute}?pageSize=${tableConfiguration?.pageSize}`, { method: 'GET' })
      .then((res) => res.json().then((res) => {
          orders = res?.orders ?? [];
          fetchingOrders = false;
        }, failure
      ),
      failure
    );
  }

  function onCreateOrder() {
    selectedOrder = undefined;
    superValidate(zod(formSchema)).then((form) => {
      selectedOrderForm = form;
      editOrderOpened = true;
    })
  }
  function onEditOrder(order: StoreOrder) {
    selectedOrder = order;
    superValidate(selectedOrder, zod(formSchema)).then((form) => {
      selectedOrderForm = form;
      editOrderOpened = true;
    })
  }
  function onOrderUpdated(event: CustomEvent) {
    const updatedOrder = event.detail;
    const orderIndex = orders.findIndex(order => order.id === updatedOrder.id);
    if (orderIndex > -1) {
      orders[orderIndex] = updatedOrder;
      orders = orders;
    }
    editOrderOpened = false;
  }
  function onOrderCreated(event: CustomEvent) {
    const createdOrder = event.detail;
    orders.unshift(createdOrder);
    orders = orders;
    editOrderOpened = false;
  }
  function deleteOrder(order: StoreOrder) {
    if (!order?.id) return;
    const body = new FormData();
    body.append('id', order.id);
    const errMsg = `failed to delete order ${order.serial_number}`;
    fetch(`/projects/${project.id}/orders`, { method: 'DELETE', body })
      .then((res) => {
        res?.json().then((res) => {
          if (res?.success) {
            toast.success(`Successfuly deleted order ${order.serial_number}`);
          } else {
            toast.error(errMsg);
          }
        }, () => {
          toast.error(errMsg);
        });
      }, () => {
        toast.error(errMsg);
      });
  }
  function copy(order: StoreOrder) {
    navigator.clipboard.writeText(String(order.serial_number))
      .then(() => {
        toast.success('Coppied to clipboard')
      })
      .catch((error) => {
        toast.error('Failed to copy: ', error)
      })
  }
  function onDeleteOrder(order: StoreOrder) {
    selectedOrder = order;
    deleteOrderOpened = true;
  }
  function onSearch(searchPhrase: string) {
    console.log(searchPhrase);
    // update total items
    // filter data by search phrase
  }

  $: project = $page.data.project;
</script>
<div class="py-5">
  {#if !fetchingOrders}
    {#if orders?.length > 0}
      <DataTable data={orders} configuration={tableConfiguration} 
        on:delete={(event)=> onDeleteOrder(event.detail)} 
        on:edit={(event)=> onEditOrder(event.detail)}
        on:create={(_) => onCreateOrder()}
        on:search={(event) => onSearch(event.detail)}
        on:copy={(event) => copy(event.detail)}/>
    {:else}
      <EmptyResults configuration={emptyResultsConfiguration} on:create={onCreateOrder}/>
    {/if}
  {:else}
    <div class="flex flex-row items-center justify-center w-full">
      <LoaderCircle class="animate-spin" size=16/>
    </div>
  {/if}
</div>

<Dialog.Root bind:open={editOrderOpened}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>{selectedOrder ? 'Edit' : 'Create'} order</Dialog.Title>
    </Dialog.Header>
    <CreateEditOrderForm 
      data={selectedOrderForm} 
      action={selectedOrder ? 'update' : 'create'}
      on:updated={(event) => onOrderUpdated(event)}
      on:created={(event) => onOrderCreated(event)}/>
  </Dialog.Content>
</Dialog.Root>


<AlertDialog.Root bind:open={deleteOrderOpened}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete order {selectedOrder && selectedOrder.serial_number} and all its related data.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action class="bg-destructive text-destructive-foreground hover:bg-destructive/80" on:click={() => selectedOrder && deleteOrder(selectedOrder)}>DELETE</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
