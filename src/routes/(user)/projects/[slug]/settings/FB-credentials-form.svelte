<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
	import { UserPermissions } from "$lib/enums/permission";
	import { toast } from "svelte-sonner";
  import { credentialsFormSchema, type CredentialsFormSchema } from "./schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
 
  export let data: SuperValidated<Infer<CredentialsFormSchema>>;
  export let permissions: UserPermissions;

  const form = superForm(data, {
    validators: zodClient(credentialsFormSchema),
    onUpdate: (event) => {
      if (event.result.status === 200) {
        toast.success('Successfully updated credentials');
        formData.set(event.result.data.form)
      } else {
        toast.error('Failed to update credentials');
      }
    },
    onError: (event) => {
      toast.error('Failed to update credentials');
    }
  });
 
  const { form: formData, enhance } = form;
  $: disabled = !permissions.includes(UserPermissions.EditDBCredentials)
</script>
<form method="POST" action="?/fb_credentials" use:enhance>
  <div class="grid gap-4 py-4">
    {#each Object.keys($formData) as key}
      <div class="grid items-center gap-4">
        <Form.Field {form} name={key}>
          <Form.Control let:attrs>
            <Form.Label>{key}</Form.Label>
            <Input {...attrs} bind:value={$formData[key]} {disabled}/>
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </div>
    {/each}
  </div>
  <Form.Button {disabled}>SAVE CHANGES</Form.Button>
</form>
