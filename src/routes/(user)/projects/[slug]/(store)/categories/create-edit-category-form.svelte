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
    
</script>
<form method="POST" action={`?/${action}`} enctype="multipart/form-data" use:enhance>
  <div class="grid gap-4 py-4">
    <div class="grid items-center gap-4">
      <Form.Field {form} name="title">
        <Form.Control let:attrs>
          <Form.Label>Title</Form.Label>
          <Input {...attrs} bind:value={$formData.title} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="display_location">
        <Form.Control let:attrs>
          <Form.Label>Display location</Form.Label>
          <Input {...attrs} type="number" bind:value={$formData.display_location} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="discount">
        <Form.Control let:attrs>
          <Form.Label>Discount <span class="text-sm text-muted-foreground">(Optional)</span></Form.Label>
          <Input {...attrs} type="number" bind:value={$formData.discount} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="imageFile">
        <Form.Control let:attrs>
          <Form.Label>Image <span class="text-sm text-muted-foreground">(Optional)</span></Form.Label> 
          <Input {...attrs} type="file" bind:value={$formData.imageFile} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
  </div>
  <Form.Button>Submit</Form.Button>
</form>
