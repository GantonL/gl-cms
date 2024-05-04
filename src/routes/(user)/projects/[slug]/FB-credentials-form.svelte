<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { credentialsFormSchema, type CredentialsFormSchema } from "./schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
 
  export let data: SuperValidated<Infer<CredentialsFormSchema>>;
 
  const form = superForm(data, {
    validators: zodClient(credentialsFormSchema),
  });
 
  const { form: formData, enhance } = form;
</script>
<form method="POST" action="?/fb_credentials" use:enhance>
  <div class="grid gap-4 py-4">
    {#each Object.keys($formData) as key}
      <div class="grid items-center gap-4">
        <Form.Field {form} name={key}>
          <Form.Control let:attrs>
            <Form.Label>{key}</Form.Label>
            <Input {...attrs} bind:value={$formData[key]} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </div>
    {/each}
  </div>
  <Form.Button>SAVE CHANGES</Form.Button>
</form>
