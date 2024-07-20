<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { formSchema, type FormSchema } from "./schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
	type SuperForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { LoaderCircle, UserRoundSearch } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import { createEventDispatcher, onMount } from "svelte";
	import * as Select from "$lib/components/ui/select";
	import { shippingOptions, statusOptions } from "../configurations";
	import OrderStatus from "$lib/components/store/order-status/order-status.svelte";
  import * as Popover from "$lib/components/ui/popover";
	import { cn } from "$lib/utils";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import type { StoreClient } from "$lib/models/store";
  import EmptyResults from "$lib/components/empty-results/empty-results.svelte";
  import { emptyClientsResultsConfiguration } from "./configuration";
	import { Separator } from "$lib/components/ui/separator";
	import { ScrollArea } from "$lib/components/ui/scroll-area";

  export let data: SuperValidated<Infer<FormSchema>>;
  export let action: 'update' | 'create';
  export let disabled = false;
  let enhance: SuperForm<Infer<FormSchema>>['enhance'];
  let form: SuperForm<Infer<FormSchema>>;
  let formData: SuperForm<Infer<FormSchema>>['form'];
  const dispatch = createEventDispatcher();
  let submissionInProgress = false;
  let clients: StoreClient[] = [];
  let clientSearchInProgress = false;

  onMount(() => {
    if (!$formData.client_id) {
      initializeClientsOptions();
    }
  });

  function initializeClientsOptions() {
    fetchClients(5);
  }
  
  function fetchClients(limit?: number, query?: string) {
    let path = `../clients?pageSize=${limit}`;
    if (query) {
      path+=`&q=${query}`;
    } 
    fetch(path, { method: 'GET' })
      .then((res) => res.json().then((res) => {
          clients = res?.clients ?? [];
          clientSearchInProgress = false;
        }
      )
    );
  }

  function updateFormData() {
    form = superForm(data.data, {
      validators: zodClient(formSchema),
      onSubmit: (input) => {
        submissionInProgress = true;
        input.formData.append('id', String($formData.id))
      },
      onUpdated: ({form: f}) => {
        if (f?.valid) {
          formData.set(f.data);
          if (action === 'create') {
            toast.success('Order was successfuly created');
            dispatch('created', f.data);
          } else {
            toast.success('Order details were successfuly updated');
            dispatch('updated', f.data);
          }
        } else {
          if (f.errors?._errors) {
            toast.error("Something went wrong.");
          } else {
            toast.error("Some fields are invalid.");
          }
        }
        submissionInProgress = false;
      }
    });
    
    enhance = form.enhance;
    formData = form.form;
  }

  updateFormData();

  $: selectedShippingOption = $formData.shipping_option ? {
    label: $formData.shipping_option,
    value: $formData.shipping_option,
  } : undefined;

  $: selectedStatus = $formData.status ? {
    label: $formData.status,
    value: $formData.status,
  } : undefined;

  let debounceSearchPhraseTimer: string | number | NodeJS.Timeout | undefined;
  function debounceSearchClientsPhrase(event: InputEvent) {
    clientSearchInProgress = true;
    clearTimeout(debounceSearchPhraseTimer);
    debounceSearchPhraseTimer = setTimeout(() => {
      fetchClients(50, event.target?.value);
    }, 250);
  }

</script>
<form method="POST" action={`?/${action}`} enctype="multipart/form-data" use:enhance>
  <div class="grid gap-4">
    <div class="grid items-center gap-4">
      <Form.Field {form} name="client_id">
        <Form.Control let:attrs>
          <Form.Label>Client ID</Form.Label>
          <Popover.Root>
            <Popover.Trigger
              {...attrs}
              class={cn(
                buttonVariants({ variant: "outline" }),
                "w-full justify-start pl-4 text-left font-normal",
                !$formData.client_id && "text-muted-foreground"
              )}
              disabled={submissionInProgress || disabled}>
              <span class="truncate w-5/6">
                {$formData.client_id || 'Select a client'}
              </span>
              <UserRoundSearch size=14 class="ml-auto h-4 w-4 opacity-50"/>
            </Popover.Trigger>
            <Popover.Content>
              <div class="flex flex-col gap-2 w-full min-h-44">
                <Input placeholder="Search name or email" 
                  on:input={debounceSearchClientsPhrase}/>
                {#if clientSearchInProgress}
                  <LoaderCircle class="animate-spin flex-grow m-auto"/>
                {:else}
                  {#if clients.length === 0}
                    <EmptyResults configuration={emptyClientsResultsConfiguration}/>
                  {:else}
                    <ScrollArea class="h-64 rounded-md border">
                      <div class="p-4">
                        <h4 class="mb-4 text-sm font-medium leading-none">Clients</h4>
                        {#each clients as client}
                          <Separator class="my-2" />
                          <Button variant="ghost" size="sm" class="w-full"
                            on:click={() => $formData.client_id = client.id}>
                            <div class="flex flex-row gap-2 items-center text-sm truncate">
                              <span>{client.name}</span>
                              <span>{client.email}</span>
                            </div>
                          </Button>
                        {/each}
                      </div>
                    </ScrollArea>
                  {/if}
                {/if}
              </div>
            </Popover.Content>
          </Popover.Root>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="shipping_option">
        <Form.Control let:attrs>
          <Form.Label>Shipping option</Form.Label>
          <Select.Root
            selected={selectedShippingOption}
            disabled={submissionInProgress || disabled}
            onSelectedChange={(v) => {
              v && ($formData.shipping_option = v.value);
            }}
          >
            <Select.Trigger {...attrs}>
              <Select.Value placeholder="Select a shipping option" />
            </Select.Trigger>
            <Select.Content>
              {#each shippingOptions as option}              
                <Select.Item value={option} label={option} />        
              {/each}
            </Select.Content>
          </Select.Root>
          <input hidden bind:value={$formData.shipping_option} name={attrs.name} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="status">
        <Form.Control let:attrs>
          <Form.Label>Status</Form.Label>
          <Select.Root
            selected={selectedStatus}
            disabled={submissionInProgress || disabled}
            onSelectedChange={(v) => {
              v && ($formData.status = v.value);
            }}
          >
            <Select.Trigger {...attrs}>
              <Select.Value placeholder="Select a status" />
            </Select.Trigger>
            <Select.Content>
              {#each statusOptions as option}              
                <Select.Item value={option}>
                  <OrderStatus status={option}/>
                </Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
          <input hidden bind:value={$formData.shipping_option} name={attrs.name} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="additional_discount">
        <Form.Control let:attrs>
          <Form.Label>Additional discount <span class="text-sm text-muted-foreground">(Optional)</span></Form.Label>
          <Input type="number" {...attrs} bind:value={$formData.additional_discount} disabled={submissionInProgress || disabled}/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
  </div>
  <Form.Button disabled={submissionInProgress || disabled}>
    <div class="flex flex-row gap-1 items-center">
      {#if submissionInProgress}
        <LoaderCircle class="animate-spin" size=16/>       
      {/if}
      <span>Submit</span>
    </div>
  </Form.Button>
</form>
