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
  import { LoaderCircle } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import { createEventDispatcher } from "svelte";
	import * as Select from "$lib/components/ui/select";
	import { shippingOptions, statusOptions } from "./configurations";
	import OrderStatus from "$lib/components/store/order-status/order-status.svelte";

  export let data: SuperValidated<Infer<FormSchema>>;
  export let action: 'update' | 'create';
  let enhance: SuperForm<Infer<FormSchema>>['enhance'];
  let form: SuperForm<Infer<FormSchema>>;
  let formData: SuperForm<Infer<FormSchema>>['form'];
  const dispatch = createEventDispatcher();
  let submissionInProgress = false;

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

</script>
<form method="POST" action={`?/${action}`} enctype="multipart/form-data" use:enhance>
  <div class="grid gap-4 py-4">
    <div class="grid items-center gap-4">
      <Form.Field {form} name="client_id">
        <Form.Control let:attrs>
          <Form.Label>Client ID</Form.Label>
          <Input {...attrs} bind:value={$formData.client_id} disabled={submissionInProgress}/>
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
      <Form.Field {form} name="items">
        <Form.Control let:attrs>
          <Form.Label>Products</Form.Label>
          <Input {...attrs} bind:value={$formData.items} disabled={submissionInProgress}/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="total_price">
        <Form.Control let:attrs>
          <Form.Label>Total price</Form.Label>
          <Input type="number" {...attrs} bind:value={$formData.total_price} disabled={submissionInProgress}/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="additional_discount">
        <Form.Control let:attrs>
          <Form.Label>Additional discount <span class="text-sm text-muted-foreground">(Optional)</span></Form.Label>
          <Input type="number" {...attrs} bind:value={$formData.additional_discount} disabled={submissionInProgress}/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
  </div>
  <Form.Button disabled={submissionInProgress}>
    <div class="flex flex-row gap-1 items-center">
      {#if submissionInProgress}
        <LoaderCircle class="animate-spin" size=16/>       
      {/if}
      <span>Submit</span>
    </div>
  </Form.Button>
</form>
