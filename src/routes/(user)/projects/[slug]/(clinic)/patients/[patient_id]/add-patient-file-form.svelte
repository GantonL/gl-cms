<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { patientFileFormSchema, type PatientFileFormSchema } from "./schema";
    import {
      type Infer,
      superForm,
      type SuperForm,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { createEventDispatcher } from "svelte";
	import { CalendarDays, LoaderCircle, UploadCloud } from "lucide-svelte";
	import * as Popover  from "$lib/components/ui/popover";
	import { cn } from "$lib/utils";
	import { buttonVariants } from "$lib/components/ui/button";
	import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today, type DateValue } from "@internationalized/date";
	import * as Select from "$lib/components/ui/select";
	import { Calendar } from "$lib/components/ui/calendar";
    
    let enhance: SuperForm<Infer<PatientFileFormSchema>>['enhance'];
    let form: SuperForm<Infer<PatientFileFormSchema>>;
    let formData: SuperForm<Infer<PatientFileFormSchema>>['form'];
    const dispatch = createEventDispatcher();
    let submissionInProgress = false;
      
    function updateFormData() {
      form = superForm({}, {
        validators: zodClient(patientFileFormSchema),
        onSubmit: (input) => {
          submissionInProgress = true;
          dispatch('inProgress', true);
        },
        onUpdated: ({form: f}) => {
          submissionInProgress = false;
          dispatch('created');
        },
        onError: () => {
          submissionInProgress = false;
          dispatch('error');
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

  let dateValuePlaceholder: DateValue = today(getLocalTimeZone());
  $: dateValue = dateValuePlaceholder;
 

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
  <form id="add-file" method="POST" action={`?/add-file`} enctype="multipart/form-data" use:enhance>
    <div class="grid gap-4">
      <div class="grid items-center gap-4">
        <Form.Field {form} name="file">
          <Form.Control let:attrs>
            <Input {...attrs} type="file" bind:value={$formData.file} disabled={submissionInProgress}/>
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </div>
      <div class="grid items-center gap-4">
        <Form.Field {form} name="date" class="flex flex-col">
          <Form.Control let:attrs>
            <Form.Label>Date <span class="text-muted-foreground">(optional)</span></Form.Label>
            <Popover.Root>
              <Popover.Trigger
                disabled={submissionInProgress}
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
                  calendarLabel="Date"
                  initialFocus
                  onValueChange={(v) => {
                    if (v) {
                      $formData.date = v.toString();
                    } else {
                      $formData.date = "";
                    }
                  }}
                />
              </Popover.Content>
            </Popover.Root>
            <Form.FieldErrors />
            <input hidden value={$formData.date} name={attrs.name} />
          </Form.Control>
        </Form.Field>
      </div>
    </div>
    <Form.Button disabled={submissionInProgress}>
        <div class="flex flex-row gap-2 items-center">
            {#if submissionInProgress}
                <LoaderCircle size=14 class="animate-spin"/>
            {:else}
                <UploadCloud size=14 />
            {/if}
        <span>Upload</span>
        </div>
    </Form.Button>
  </form>
  