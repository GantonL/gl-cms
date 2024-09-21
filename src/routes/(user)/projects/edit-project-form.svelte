<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
	import { t } from "$lib/i18n/translations";
	import { createEventDispatcher } from "svelte";
  import { editFormSchema, type EditFormSchema } from "./schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
	import { LoaderCircle } from "lucide-svelte";
 
  export let data: SuperValidated<Infer<EditFormSchema>>;
 
  let submissionInProgress = false;
  const dispatch = createEventDispatcher();

  const form = superForm(data, {
    validators: zodClient(editFormSchema),
    onSubmit: (input) => {
      submissionInProgress = true;
      input.formData.set('id', String($formData.id))
    },
    onUpdated: (event) => {
      dispatch('updated', event.form.data);
    }
  });
 
  const { form: formData, enhance } = form;
</script>
<form method="POST" action="?/edit" use:enhance>
  <div class="grid gap-4 py-4">
    <div class="grid items-center gap-4">
      <Form.Field {form} name="display_name">
        <Form.Control let:attrs>
          <Form.Label>{$t('common.name')}</Form.Label>
          <Input {...attrs} bind:value={$formData.display_name} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="url">
        <Form.Control let:attrs>
          <Form.Label>{$t('common.url')} <span class="text-sm text-muted-foreground">({$t('common.optional')})</span></Form.Label>
          <Input {...attrs} bind:value={$formData.url} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
  </div>
  <Form.Button class="flex flex-row gap-2 items-center" disabled={submissionInProgress}>
    {#if submissionInProgress}
      <LoaderCircle size=14 class="animate-spin"/>
    {/if}
    <span>
      {$t('common.submit')}
    </span>
  </Form.Button>
</form>
