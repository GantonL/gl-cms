<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
	import { DateFormatter, getLocalTimeZone, parseDate } from "@internationalized/date";
  import { formSchema, type FormSchema } from "./schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
	type SuperForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
	import { cn } from "$lib/utils";
	import { buttonVariants } from "$lib/components/ui/button";
  import { Calendar } from "$lib/components/ui/calendar";
  import * as Popover from "$lib/components/ui/popover";
  import { CalendarDays, LoaderCircle } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import { createEventDispatcher } from "svelte";

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
        input.formData.set('id', String($formData.id))
      },
      onUpdated: ({form: f}) => {
        if (f?.valid) {
          toast.success('Client details were successfuly updated');
          if (f.data.date_of_birth === 'undefined') {
            f.data.date_of_birth = undefined;
          }
          formData.set(f.data);
          if (action === 'create') {
            dispatch('created', f.data);
          } else {
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

  const dateFormat = 'en-UK';
  const dateFormatter = new DateFormatter(dateFormat, {
    dateStyle: "long"
  });

  $: dateValue = $formData.date_of_birth ? parseDate($formData.date_of_birth) : undefined;
 
</script>
<form method="POST" action={`?/${action}`} enctype="multipart/form-data" use:enhance>
  <div class="grid gap-4 py-4">
    <div class="grid items-center gap-4">
      <Form.Field {form} name="name">
        <Form.Control let:attrs>
          <Form.Label>Name</Form.Label>
          <Input {...attrs} bind:value={$formData.name} disabled={submissionInProgress}/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="email">
        <Form.Control let:attrs>
          <Form.Label>Email</Form.Label>
          <Input {...attrs} bind:value={$formData.email} disabled={submissionInProgress}/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="home_address">
        <Form.Control let:attrs>
          <Form.Label>Home address</Form.Label>
          <Input {...attrs} bind:value={$formData.home_address} disabled={submissionInProgress}/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="shipping_address">
        <Form.Control let:attrs>
          <Form.Label>Shipping address</Form.Label>
          <Input {...attrs} bind:value={$formData.shipping_address} disabled={submissionInProgress}/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="phone_number">
        <Form.Control let:attrs>
          <Form.Label>Phone number</Form.Label>
          <Input {...attrs} bind:value={$formData.phone_number} disabled={submissionInProgress}/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="date_of_birth" class="flex flex-col">
        <Form.Control let:attrs>
          <Form.Label>Date of birth <span class="text-sm text-muted-foreground">(Optional)</span></Form.Label>
          <Popover.Root>
            <Popover.Trigger
              disabled={submissionInProgress}
              {...attrs}
              class={cn(
                buttonVariants({ variant: "outline" }),
                "w-full justify-start ps-4 text-start font-normal",
                !dateValue && "text-muted-foreground"
              )}
            >
              {dateValue ? dateFormatter.format(dateValue.toDate(getLocalTimeZone())) : "Pick a date"}
              <CalendarDays  class="ms-auto h-4 w-4 opacity-50" />
            </Popover.Trigger>
            <Popover.Content class="w-auto p-0" side="top">
              <Calendar
                bind:value={dateValue}
                initialFocus
                onValueChange={(v) => {
                  if (v) {
                    $formData.date_of_birth = v.toString();
                  } else {
                    $formData.date_of_birth = "";
                  }
                }}
              />
            </Popover.Content>
          </Popover.Root>
          <Form.FieldErrors />
          <input hidden value={$formData.date_of_birth} name={attrs.name} />
        </Form.Control>
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
