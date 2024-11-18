<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
	import { t } from "$lib/i18n/translations";
  import { formSchema, type FormSchema } from "./schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
 
  export let data: SuperValidated<Infer<FormSchema>>;
 
  const form = superForm(data, {
    validators: zodClient(formSchema),
  });
 
  const { form: formData, enhance } = form;
</script>
<form method="POST" action="?/create" use:enhance enctype="multipart/form-data">
  <div class="grid gap-4 py-4">
    <div class="grid items-center gap-4">
      <Form.Field {form} name="name">
        <Form.Control let:attrs>
          <Form.Label>{$t('common.name')}</Form.Label>
          <Input {...attrs} bind:value={$formData.name} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="type">
        <Form.Control let:attrs>
          <Form.Label>{$t('common.type')}</Form.Label>
          <Input {...attrs} bind:value={$formData.type} />
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
    <div class="grid items-center gap-4">
      <Form.Field {form} name="logoFile">
        <Form.Control let:attrs>
          <Form.Label>{$t('common.logo')} <span class="text-sm text-muted-foreground">({$t('common.optional')})</span></Form.Label>
          <Input type="file" {...attrs} bind:value={$formData.logoFile} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
  </div>
  <Form.Button>{$t('common.submit')}</Form.Button>
</form>
