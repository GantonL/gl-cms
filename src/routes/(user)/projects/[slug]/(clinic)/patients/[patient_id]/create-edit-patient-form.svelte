<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { patientFormSchema, type PatientFormSchema } from "./schema";
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
	import { buttonVariants } from "$lib/components/ui/button";
	import { cn } from "$lib/utils";
  import { Textarea } from "$lib/components/ui/textarea";
	import { locale, t } from "$lib/i18n/translations";

  export let data: SuperValidated<Infer<PatientFormSchema>>;
  export let action: 'update' | 'create';
  export let disabled = false;

  let enhance: SuperForm<Infer<PatientFormSchema>>['enhance'];
  let form: SuperForm<Infer<PatientFormSchema>>;
  let formData: SuperForm<Infer<PatientFormSchema>>['form'];
  const dispatch = createEventDispatcher();
  let submissionInProgress = false;

  
  function updateFormData() {
    form = superForm(data.data, {
      dataType: 'json',
      validators: zodClient(patientFormSchema),
      onSubmit: (input) => {
        submissionInProgress = true;
        input.formData.set('id', String($formData.id));
      },
      onUpdated: ({form: f}) => {
        if (f?.valid) {
          formData.set(f.data);
          if (action === 'create') {
            toast.success(t.get('common.patient_created_success'));
            dispatch('created', f.data);
          } else {
            toast.success(t.get('common.patient_details_update_success'));
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

  const dateFormat = t.get(`common.date_format_type.${locale.get()}`);
  const dateFormatter = new DateFormatter(dateFormat, {
    dateStyle: "long"
  });

  $: dateValue = $formData.date_of_birth ? parseDate($formData.date_of_birth) : undefined;
     
  const genders = [
    {value: 'female', label: t.get('common.female')},
    {value: 'male', label: t.get('common.male')},
    {value: 'other', label: t.get('common.other')},
  ]

</script>
<form method="POST" action={`?/${action}`} enctype="multipart/form-data" use:enhance>
  <div class="grid gap-4">
    <div class="grid items-center gap-4">
      <Form.Field {form} name="first_name">
        <Form.Control let:attrs>
          <Form.Label>{$t('common.first_name')}</Form.Label>
          <Input {...attrs} bind:value={$formData.first_name} disabled={submissionInProgress}/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="sur_name">
        <Form.Control let:attrs>
          <Form.Label>{$t('common.surname')}</Form.Label>
          <Input {...attrs} bind:value={$formData.sur_name} disabled={submissionInProgress}/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="personal_id">
        <Form.Control let:attrs>
          <Form.Label>{$t('common.ID')}</Form.Label>
          <Input {...attrs} bind:value={$formData.personal_id} disabled={submissionInProgress}/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="address">
        <Form.Control let:attrs>
          <Form.Label>{$t('common.address')}</Form.Label>
          <Input {...attrs} bind:value={$formData.address} disabled={submissionInProgress}/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="email">
        <Form.Control let:attrs>
          <Form.Label>{$t('common.email')}</Form.Label>
          <Input {...attrs} bind:value={$formData.email} disabled={submissionInProgress}/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="phone">
        <Form.Control let:attrs>
          <Form.Label>{$t('common.phone')}</Form.Label>
          <Input {...attrs} bind:value={$formData.phone} disabled={submissionInProgress}/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="date_of_birth" class="flex flex-col">
        <Form.Control let:attrs>
          <Form.Label>{$t('common.date_of_birth')}</Form.Label>
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
    <div class="grid items-center gap-4">
      <Form.Field {form} name="phone">
        <Form.Control let:attrs>
          <Form.Label>{$t('common.gender')}</Form.Label>
          <Select.Root
            items={genders}
            {...attrs}
            disabled={submissionInProgress}
            selected={{value: $formData.gender, label: $formData.gender}}
            onSelectedChange={(v) => {
              if (!v) return;
              $formData.gender = v.value
            }}
          >
            <Select.Trigger>
              <Select.Value placeholder={$t('common.gender')} />
            </Select.Trigger>
            <Select.Content class="max-h-48 overflow-auto">
              {#each genders as item}
                <Select.Item value={item.value}>{$t(item.label)}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="refered_by">
        <Form.Control let:attrs>
          <Form.Label>{$t('common.refered_by')}</Form.Label>
          <Input {...attrs} bind:value={$formData.refered_by} disabled={submissionInProgress}/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="medical_condition">
        <Form.Control let:attrs>
          <Form.Label>{$t('common.medical_condition')}</Form.Label> 
          <Textarea {...attrs} bind:value={$formData.medical_condition} disabled={submissionInProgress}/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="medications">
        <Form.Control let:attrs>
          <Form.Label>{$t('common.medications')}</Form.Label> 
          <Textarea {...attrs} bind:value={$formData.medications} disabled={submissionInProgress}/>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="notes">
        <Form.Control let:attrs>
          <Form.Label>{$t('common.notes')}</Form.Label> 
          <Textarea {...attrs} bind:value={$formData.notes} disabled={submissionInProgress}/>
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
      <span>{$t('common.submit')}</span>
    </div>
  </Form.Button>
</form>
