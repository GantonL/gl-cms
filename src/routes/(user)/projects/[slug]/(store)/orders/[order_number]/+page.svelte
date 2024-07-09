<script lang="ts">
	import { page } from "$app/stores";
	import * as Card from "$lib/components/ui/card";
  import EmptyResults from "$lib/components/empty-results/empty-results.svelte";
	import { emptyProductsResultsConfiguration } from "./configuration";

  function onAddProduct() {

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