<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
	import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today, type DateValue } from "@internationalized/date";
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
  import * as Select from "$lib/components/ui/select";
  import { CalendarDays } from "lucide-svelte";

  export let data: SuperValidated<Infer<FormSchema>>;
  export let action: 'update' | 'create';
  let enhance: SuperForm<Infer<FormSchema>>['enhance'];
  let form: SuperForm<Infer<FormSchema>>;
  let formData: SuperForm<Infer<FormSchema>>['form'];

  function updateFormData() {
    form = superForm(data.data, {
      validators: zodClient(formSchema),
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
 
  let dateValuePlaceholder: DateValue = today(getLocalTimeZone());

  const earliestYear = 1900;
  const years = [...Array(dateValuePlaceholder.year - earliestYear).keys()].map((_, index) => {
    const year = index + earliestYear; 
    return {
      value: year,
      label: String(year)
    }
  }).reverse();

  const months = [...Array(12).keys()].map((_, index) => {
    const dateInMonth = new CalendarDate(earliestYear, index+1, 1);
    const label = new Intl.DateTimeFormat(dateFormat, {month: 'short'});
    const value = dateInMonth.month; 
    return {
      value,
      label: label.format(dateInMonth.toDate(getLocalTimeZone()))
    }
  });
</script>
<form method="POST" action={`?/${action}`} enctype="multipart/form-data" use:enhance>
  <div class="grid gap-4 py-4">
    <div class="grid items-center gap-4">
      <Form.Field {form} name="name">
        <Form.Control let:attrs>
          <Form.Label>Name</Form.Label>
          <Input {...attrs} bind:value={$formData.name} required/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="email">
        <Form.Control let:attrs>
          <Form.Label>Email</Form.Label>
          <Input {...attrs} bind:value={$formData.email} required/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="home_address">
        <Form.Control let:attrs>
          <Form.Label>Home address</Form.Label>
          <Input {...attrs} bind:value={$formData.home_address} required/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="shipping_address">
        <Form.Control let:attrs>
          <Form.Label>Shipping address</Form.Label>
          <Input {...attrs} bind:value={$formData.shipping_address} required/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="phone_number">
        <Form.Control let:attrs>
          <Form.Label>Phone number</Form.Label>
          <Input {...attrs} bind:value={$formData.phone_number} required/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="date_of_birth" class="flex flex-col">
        <Form.Control let:attrs>
          <Form.Label>Date of birth</Form.Label>
          <Popover.Root>
            <Popover.Trigger
              {...attrs}
              class={cn(
                buttonVariants({ variant: "outline" }),
                "w-full justify-start pl-4 text-left font-normal",
                !dateValue && "text-muted-foreground"
              )}
            >
              {dateValue ? dateFormatter.format(dateValue.toDate(getLocalTimeZone())) : "Pick a date"}
              <CalendarDays  class="ml-auto h-4 w-4 opacity-50" />
            </Popover.Trigger>
            <Popover.Content class="w-auto p-0" side="top">
              <div class="flex flex-row gap-2 p-2">
                <Select.Root
                  items={years}
                  selected={dateValue && {value: dateValue.year, label: String(dateValue.year)}}
                  onSelectedChange={(v) => {
                    if (!v) return;
                    if (dateValue) {
                      dateValue = dateValue.set({year: v.value})
                    } else {
                      dateValue = new CalendarDate(v.value, 1, 1);
                    }
                  }}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Year" />
                  </Select.Trigger>
                  <Select.Content class="max-h-48 overflow-auto">
                    {#each years as item}
                      <Select.Item value={item.value}>{item.label}</Select.Item>
                    {/each}
                  </Select.Content>
                </Select.Root>
                <Select.Root
                  items={months}
                  selected={dateValue && {value: dateValue.month, label: months.find(m => m.value === dateValue.month).label}}
                  onSelectedChange={(v) => {
                    if (!v) return;
                    if (dateValue) {
                      dateValue = dateValue.set({month: v.value})
                    } else {
                      dateValue = new CalendarDate(dateValuePlaceholder.year, v.value, 1);
                    }
                  }}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Month" />
                  </Select.Trigger>
                  <Select.Content class="max-h-48 overflow-auto">
                    {#each months as item}
                      <Select.Item value={item.value}>{item.label}</Select.Item>
                    {/each}
                  </Select.Content>
                </Select.Root>
              </div>
              <Calendar
                bind:value={dateValue}
                bind:placeholder={dateValuePlaceholder}
                minValue={new CalendarDate(earliestYear, 1, 1)}
                maxValue={today(getLocalTimeZone())}
                calendarLabel="Date of birth"
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
  <Form.Button>Submit</Form.Button>
</form>
