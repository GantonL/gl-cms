<script lang="ts">
	import { page } from "$app/stores";
	import * as Card from "$lib/components/ui/card";
  import EmptyResults from "$lib/components/empty-results/empty-results.svelte";
	import { emptyProductsResultsConfiguration, emptyProductsSearchResultsConfiguration, productsTableRowActions, productTableConfiguration } from "./configuration";
	import CreateEditOrderForm from "./create-edit-order-form.svelte";
	import { superValidate, type Infer, type SuperValidated } from "sveltekit-superforms";
	import { formSchema, type FormSchema } from "./schema";
	import { onMount } from "svelte";
	import { zod } from "sveltekit-superforms/adapters";
	import type { StoreOrder, StoreOrderItem, StoreProduct } from "$lib/models/store";
	import { toast } from "svelte-sonner";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import { Button } from "$lib/components/ui/button";
	import { LoaderCircle, MinusCircle, PlusCircle } from "lucide-svelte";
	import { goto } from "$app/navigation";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Input } from "$lib/components/ui/input";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import { Separator } from "$lib/components/ui/separator";
	import DataTable from "$lib/components/data-table/data-table.svelte";
  
  let createEditForm: SuperValidated<Infer<FormSchema>>;
  let deleteOrderOpened = false;
  let deletionInProgress = false;
  let saveInProgress = false;
  let addProductsDailogOpened = false;
  let fetchProductsInProgress = false;
  let products: Record<string, any>[] = [];
  let productsOptions: StoreProduct[] = [];
  let createEditNonFormData: {total_price: number; items: StoreOrderItem[]} = {total_price: 0, items: []};
  
  onMount(() => {
    initializeForm();
    initializeProducts();
    calculateTotalPrice();
    handleOrderAction();
  })

  function initializeForm() {
    superValidate(order, zod(formSchema)).then((form) => {
      createEditForm = form;
    })
  }

  function initializeProducts() {
    products = order.items?.map((item) => {
      const product = order.products?.find(product => product.id === item.product_id);
      return {
        serial_number: product?.serial_number,
        name: product?.name,
        amount: item.amount,
        id: item.product_id,
      }
    });
    createEditNonFormData.items = order.items;
    createEditNonFormData = createEditNonFormData;
  }
  
  function calculateTotalPrice() {
    let totalPrice = order.items?.reduce((acc, curr) => {
      const product = order.products?.find(product => product.id === curr.product_id);
      if (!product) { return acc };
      return acc += product.price * ((100 - (product.discount ?? 0))/100) * curr.amount;
    }, 0) ?? 0;
    totalPrice = totalPrice * ((100 - (order.additional_discount ?? 0))/100);
    totalPrice = Number(totalPrice.toFixed(2));
    order.total_price = totalPrice;
    createEditNonFormData.total_price = order.total_price;
    createEditNonFormData = createEditNonFormData;
  }

  function handleOrderAction() {
    const disabledByStatus = order.status === 'delivered' || order.status === 'canceled'; 
    productsTableRowActions.items[1].disabled = disabledByStatus;
    productTableConfiguration.columns = productTableConfiguration.columns;
    if (productTableConfiguration.createItemButton) {
      productTableConfiguration.createItemButton.disabled = disabledByStatus;
    } 
  }

  function onAddProduct() {
    addProductsDailogOpened = true;
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
    let path = `../products?pageSize=${limit}`;
    if (query) {
      path+=`&q=${query}`;
    } 
    fetch(path, { method: 'GET' })
      .then((res) => res.json().then((res) => {
          productsOptions = res?.products ?? [];
          fetchProductsInProgress = false;
        }
      )
    );
  }

  function addProductToOrder(product: StoreProduct) {
    if (!order.items) {
      order.items = [];
    }
    if (!order.products) {
      order.products = [];
    }
    const exisitingProduct = order.items.find((item) => item.product_id === product.id);
    if (exisitingProduct) {
      exisitingProduct.amount++;
    } else {
      order.items.push({
        product_id: product.id,
        amount: 1
      });
      order.products?.push(product);
    }
    initializeProducts();
    calculateTotalPrice();
  }

  function increaseOrderItem(productId: string) {
    const exisitingProduct = order.items.find((exisitingItem) => exisitingItem.product_id === productId);
    if (exisitingProduct) {
      exisitingProduct.amount++;
    }
    initializeProducts();
    calculateTotalPrice();
  }

  
  function removeProductFromOrder(product: StoreProduct) {
    const exisitingProductIndex = order.items.findIndex((item) => item.product_id === product.id);
    if (exisitingProductIndex > -1) {
      const exisitingProduct = order.items[exisitingProductIndex];
      exisitingProduct.amount--;
      if (exisitingProduct.amount === 0) {
        order.items.splice(exisitingProductIndex, 1);
      }
      initializeProducts();
      calculateTotalPrice();
    }
  }

  function decreaseOrderItem(productId: string) {
    const exisitingProductIndex = order.items.findIndex((exisitingItem) => exisitingItem.product_id === productId);
    if (exisitingProductIndex > -1) {
      const exisitingProduct = order.items[exisitingProductIndex];
      exisitingProduct.amount--;
      if (exisitingProduct.amount === 0) {
        order.items.splice(exisitingProductIndex, 1);
      }
      initializeProducts();
      calculateTotalPrice();
    }
  }

  function deleteOrderItem(productId: string) {
    const exisitingProductIndex = order.items.findIndex((exisitingItem) => exisitingItem.product_id === productId);
    if (exisitingProductIndex > -1) {
      order.items.splice(exisitingProductIndex, 1);
      initializeProducts();
      calculateTotalPrice();
    }
  }

  $: order = $page.data.order as StoreOrder & { products?: StoreProduct[] };
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
    <div class="flex flex-col gap-4">
      <div class="flex flex-row flex-wrap gap-4">
        <Card.Root class="flex-grow">
          <Card.Header>
            <Card.Title>Details</Card.Title>
            <Card.Description>General information about this order</Card.Description>
          </Card.Header>
          <Card.Content>
            {#if createEditForm}
              <CreateEditOrderForm 
                data={createEditForm}
                nonFormData={createEditNonFormData}
                disabled={saveInProgress || deletionInProgress}
                action={order ? 'update' : 'create'}
                on:updated={(event) => onOrderUpdated(event)}
                on:created={(event) => onOrderCreated(event)}/>
            {/if}
          </Card.Content>
        </Card.Root>
        <Card.Root class="flex-grow">
          <Card.Header>
            <Card.Title>Products</Card.Title>
            <Card.Description>Handle products related to this order</Card.Description>
          </Card.Header>
          <Card.Content>
            {#if !products || products?.length === 0}
              <EmptyResults configuration={emptyProductsResultsConfiguration} on:create={onAddProduct}/>
            {:else}
              <DataTable 
                data={products}
                configuration={productTableConfiguration} 
                on:create={onAddProduct}
                on:increase={(event) => increaseOrderItem(event.detail.id)}
                on:decrease={(event) => decreaseOrderItem(event.detail.id)}
                on:delete={(event) => deleteOrderItem(event.detail.id)}/>
              {/if}
            </Card.Content>
        </Card.Root>
      </div>
      <Card.Root class="flex-grow">
        <Card.Header>
          <Card.Title>Summary</Card.Title>
          <Card.Description>Total price and payment status</Card.Description>
        </Card.Header>
        <Card.Content>
          <div class="flex flex-col gap-4">
            <div>Total price: {order.total_price}</div>
            {#if order.serial_number}
              <div class="flex flex-row items-center justify-between flex-wrap">
                <div>Payment Status: {order.payment_status ?? ''}</div>
                <Button variant="secondary" size="lg" disabled={!['awaiting', 'partial', undefined].includes(order.payment_status) || !order.total_price}>
                  {#if order.payment_status === 'in_process'}
                    <LoaderCircle size=14/>
                  {/if}
                  PAYMENT
                </Button>
              </div>
            {/if}
          </div>
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
        This action cannot be undone. This will permanently delete order {order.serial_number} and all of its related data.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action class="bg-destructive text-destructive-foreground hover:bg-destructive/80" on:click={() => deleteOrder(order)}>DELETE</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<Dialog.Root bind:open={addProductsDailogOpened}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Add products</Dialog.Title>
    </Dialog.Header>
    <Input placeholder="Search name or serial number" 
      on:input={debounceSearchProductsPhrase}/>
    {#if fetchProductsInProgress}
      <LoaderCircle class="animate-spin flex-grow m-auto"/>
    {:else}
      {#if !productsOptions || productsOptions.length === 0}
        <EmptyResults configuration={emptyProductsSearchResultsConfiguration}/>
      {:else}
        <ScrollArea class="h-64 rounded-md border">
          <div class="p-4">
            <h4 class="mb-4 text-sm font-medium leading-none">Products</h4>
            {#each productsOptions as product}
              <Separator class="my-2" />
              <div class="flex flex-row items-center justify-between gap-2 w-full">
                <span class="truncate w-5/6">{product.name} | {product.serial_number}</span>
                <div class="flex flex-row gap-2 items-center">
                  <Button variant="ghost" size="icon"
                    on:click={(_) => addProductToOrder(product)}>
                    <PlusCircle size=14/>
                  </Button>
                  <Button variant="ghost" size="icon"
                    disabled={!order.items?.find(item => item.product_id === product.id)}
                    on:click={(_) => removeProductFromOrder(product)}>
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