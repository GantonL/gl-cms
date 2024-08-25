<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { patientTreatmentFormSchema, type PatientTreatmentFormSchema } from "./schema";
    import {
      type SuperValidated,
      type Infer,
      superForm,
      type SuperForm,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { CalendarDays, LoaderCircle } from "lucide-svelte";
      import { toast } from "svelte-sonner";
      import { createEventDispatcher } from "svelte";
      import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today, type DateValue } from "@internationalized/date";
      import * as Popover from "$lib/components/ui/popover";
      import * as Select from "$lib/components/ui/select";
      import { Calendar } from "$lib/components/ui/calendar";
      import { Button, buttonVariants } from "$lib/components/ui/button";
      import { cn } from "$lib/utils";
    import { Textarea } from "$lib/components/ui/textarea";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
  
    export let data: SuperValidated<Infer<PatientTreatmentFormSchema>>;
    export let action: 'update-treatment' | 'create-treatment';
    export let disabled = false;
  
    let enhance: SuperForm<Infer<PatientTreatmentFormSchema>>['enhance'];
    let form: SuperForm<Infer<PatientTreatmentFormSchema>>;
    let formData: SuperForm<Infer<PatientTreatmentFormSchema>>['form'];
    const dispatch = createEventDispatcher();
    let submissionInProgress = false;
  
    
    function updateFormData() {
      form = superForm(data.data, {
        dataType: 'json',
        validators: zodClient(patientTreatmentFormSchema),
        onSubmit: (input) => {
          submissionInProgress = true;
          input.formData.set('id', String($formData.id));
        },
        onUpdated: ({form: f}) => {
          if (f?.valid) {
            formData.set(f.data);
            if (action === 'create-treatment') {
              toast.success('Treatment was successfuly created');
              dispatch('created', f.data);
            } else {
              toast.success('Treatment was successfuly updated');
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
  
    let dateValuePlaceholder: DateValue = today(getLocalTimeZone());
    $: dateValue = $formData.date ? parseDate($formData.date) : dateValuePlaceholder;
   
  
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
    <ScrollArea class="flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
      <div class="grid items-center gap-4">
        <Form.Field {form} name="date" class="flex flex-col">
          <Form.Control let:attrs>
            <Form.Label>Date</Form.Label>
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
                  calendarLabel="Date of birth"
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
      <div class="grid items-center gap-4">
        <Form.Field {form} name="documentation">
          <Form.Control let:attrs>
            <Form.Label>Documentation</Form.Label> 
            <Textarea {...attrs} bind:value={$formData.documentation} disabled={submissionInProgress}/>
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </div>
      <div class="grid items-center gap-4">
        <Form.Field {form} name="notes">
          <Form.Control let:attrs>
            <Form.Label>Notes <span class="text-muted-foreground">(optional)</span></Form.Label> 
            <Textarea {...attrs} bind:value={$formData.notes} disabled={submissionInProgress}/>
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </div>
      <div class="grid items-center gap-4">
        <Form.Field {form} name="price">
          <Form.Control let:attrs>
            <Form.Label>Price</Form.Label> 
            <Input type="number" min=0 {...attrs} bind:value={$formData.price} disabled={submissionInProgress}/>
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </div>

    </ScrollArea>
    <div class="flex flex-row gap-2 items-center">
      <Form.Button disabled={submissionInProgress || disabled}>
        <div class="flex flex-row gap-1 items-center">
          {#if submissionInProgress}
            <LoaderCircle class="animate-spin" size=16/>       
          {/if}
          <span>Submit</span>
        </div>
      </Form.Button>
      <Button variant="secondary" on:click={() => {dispatch('cancel')}}>Cancel</Button>
    </div>
  </form>
  