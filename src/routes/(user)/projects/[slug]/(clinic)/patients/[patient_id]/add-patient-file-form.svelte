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
	import { DateFormatter, getLocalTimeZone, today } from "@internationalized/date";
	import { Calendar } from "$lib/components/ui/calendar";
	import { locale, t } from "$lib/i18n/translations";
    
  export let action = 'add-file';

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

    const dateFormat = t.get(`common.date_format_type.${locale.get()}`);
  const dateFormatter = new DateFormatter(dateFormat, {
    dateStyle: "long"
  });
  
  $: dateValue = today(getLocalTimeZone());
        
  </script>
  <form id="add-file" method="POST" action={`?/${action}`} enctype="multipart/form-data" use:enhance>
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
            <Form.Label>{$t('common.date')} <span class="text-muted-foreground">({$t('common.optional')})</span></Form.Label>
            <Popover.Root>
              <Popover.Trigger
                disabled={submissionInProgress}
                {...attrs}
                class={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full justify-start pl-4 text-start font-normal",
                  !dateValue && "text-muted-foreground"
                )}
              >
                {dateValue ? dateFormatter.format(dateValue.toDate(getLocalTimeZone())) : t.get('common.pick_date')}
                <CalendarDays  class="ml-auto h-4 w-4 opacity-50" />
              </Popover.Trigger>
              <Popover.Content class="w-auto p-0" side="top">
                <Calendar
                  bind:value={dateValue}
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
    <Form.Button disabled={submissionInProgress || !$formData.file}>
        <div class="flex flex-row gap-2 items-center">
            {#if submissionInProgress}
                <LoaderCircle size=14 class="animate-spin"/>
            {:else}
                <UploadCloud size=14 />
            {/if}
        <span>{$t('common.upload')}</span>
        </div>
    </Form.Button>
  </form>
  