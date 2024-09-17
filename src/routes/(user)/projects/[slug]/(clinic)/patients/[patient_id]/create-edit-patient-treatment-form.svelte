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
    import { DateFormatter, getLocalTimeZone, now, parseDate, parseTime, Time } from "@internationalized/date";
    import * as Popover from "$lib/components/ui/popover";
    import { Calendar } from "$lib/components/ui/calendar";
    import { Button, buttonVariants } from "$lib/components/ui/button";
    import { cn } from "$lib/utils";
    import { Textarea } from "$lib/components/ui/textarea";
    import { ScrollArea } from "$lib/components/ui/scroll-area";
	  import { locale, t } from "$lib/i18n/translations";
  
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
              toast.success(t.get('common.treatment_create_success'));
              dispatch('created', f.data);
            } else {
              toast.success(t.get('common.treatment_updated_success'));
              dispatch('updated', f.data);
            }
          } else {
            if (f.errors?._errors) {
              toast.error(t.get('common.something_went_wrong'));
            } else {
              toast.error(t.get('common.invalid_fields'));
            }
          }
          submissionInProgress = false;
        }
      });
      
      enhance = form.enhance;
      formData = form.form;
    }
  
    updateFormData();
  
    const dateFormatter = new DateFormatter(t.get(`common.date_format_type.${locale.get()}`), {
      dateStyle: "long",
    });
  
    const nowDateTime = now(getLocalTimeZone());
    $: timeValue = $formData.time ? new Time(parseTime($formData.time).hour, parseTime($formData.time).minute) : new Time(nowDateTime.hour, nowDateTime.minute);
    $: dateValue = $formData.date ? parseDate($formData.date) : undefined;
    
  </script>
  <form method="POST" action={`?/${action}`} enctype="multipart/form-data" use:enhance>
    <ScrollArea class="flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
      <div class="grid items-center gap-4">
        <Form.Field {form} name="date" class="flex flex-col">
          <Form.Control let:attrs>
            <Form.Label>{$t('common.date')}</Form.Label>
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
                {dateValue ? dateFormatter.format(dateValue.toDate(getLocalTimeZone())) : t.get('common.pick_date')}
                <CalendarDays  class="ms-auto h-4 w-4 opacity-50" />
              </Popover.Trigger>
              <Popover.Content class="w-auto p-0" side="top">
                <Calendar
                  bind:value={dateValue}
                  time={timeValue}
                  includeTime={true}
                  initialFocus
                  onValueChange={(v) => {
                    $formData.date = v?.toString() ?? '';
                    $formData.time = timeValue.toString();
                  }}
                  on:timeChanged={(t) => {
                    console.log(t.detail)
                    $formData.time = t?.detail?.toString() ?? '';
                  }}
                />
              </Popover.Content>
            </Popover.Root>
            <Form.FieldErrors />
            <input hidden value={$formData.date} name={attrs.name}/>
          </Form.Control>
        </Form.Field>
      </div>
      <div class="grid items-center gap-4">
        <Form.Field {form} name="documentation">
          <Form.Control let:attrs>
            <Form.Label>{$t('common.documentation')}</Form.Label> 
            <Textarea {...attrs} class="min-h-48" bind:value={$formData.documentation} disabled={submissionInProgress} required/>
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </div>
      <div class="grid items-center gap-4">
        <Form.Field {form} name="notes">
          <Form.Control let:attrs>
            <Form.Label>{$t('common.notes')} <span class="text-muted-foreground">({$t('common.optional')})</span></Form.Label> 
            <Textarea {...attrs} bind:value={$formData.notes} disabled={submissionInProgress}/>
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </div>
      <div class="grid items-center gap-4">
        <Form.Field {form} name="price">
          <Form.Control let:attrs>
            <Form.Label>{$t('common.price')}</Form.Label> 
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
          <span>{$t('common.submit')}</span>
        </div>
      </Form.Button>
      <Button variant="secondary" on:click={() => {dispatch('cancel')}}>{$t('common.cancel')}</Button>
    </div>
  </form>
  