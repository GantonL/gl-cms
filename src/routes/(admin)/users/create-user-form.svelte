<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { formSchema, type FormSchema } from "./schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import * as Select from "$lib/components/ui/select";

  export let data: {
    form: SuperValidated<Infer<FormSchema>>
    projects: string[],    
  };
 
  const form = superForm(data.form, {
    validators: zodClient(formSchema),
  });
 
  const { form: formData, enhance } = form;
</script>
<form method="POST" use:enhance>
  <div class="grid gap-4 py-4">
    <div class="grid items-center gap-4">
      <Form.Field {form} name="name">
        <Form.Control let:attrs>
          <Form.Label>Name</Form.Label>
          <Input {...attrs} bind:value={$formData.name} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="email">
        <Form.Control let:attrs>
          <Form.Label>Email</Form.Label>
          <Input {...attrs} bind:value={$formData.email} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="role">
        <Form.Control let:attrs>
          <Form.Label>Role</Form.Label>
          <Input {...attrs} bind:value={$formData.role} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="projects">
        <Form.Control let:attrs>
          <Form.Label>Project</Form.Label>
          <Select.Root
            onSelectedChange={(v) => v && ($formData.projects = [`${v.value}`])}
          >
            <Select.Trigger {...attrs}>
              <Select.Value placeholder="Select a project to assign" />
            </Select.Trigger>
            <Select.Content>
              {#each data.projects as project}
                <Select.Item value={project} label={project} />                
              {/each}
            </Select.Content>
          </Select.Root>
          <input hidden bind:value={$formData.projects} name={attrs.name} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
  </div>
  <Form.Button>Submit</Form.Button>
</form>
