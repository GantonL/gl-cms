<script lang="ts">
	import { page } from "$app/stores";
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
	import { toast } from "svelte-sonner";
  import { formSchema } from "./schema";
  import {
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
	import { Link, LoaderCircle } from "lucide-svelte";
 
  let savingInProgress = false;

  const form = superForm($page.data.form, {
    validators: zodClient(formSchema),
    onSubmit: () => {
      savingInProgress = true
    },
    onUpdated: ({ form: f }) => {
      savingInProgress = false;
      if (f?.valid) {
        toast.success('Contact details were successfuly updated');
        formData.set(f.data);
      } else {
        if (f.errors?._errors) {
          toast.error("Something went wrong.");
        } else {
          toast.error("Some fields are invalid.");
        }
      }
    }
  });
 
  const { form: formData, enhance } = form;
</script>
<form method="POST" use:enhance>
  <div class="grid gap-4 py-4">
    <div class="grid items-center gap-4">
      <Form.Field {form} name="name">
        <Form.Control let:attrs>
          <Form.Label>Name</Form.Label>
          <Input {...attrs} disabled={savingInProgress} bind:value={$formData.name} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="email">
        <Form.Control let:attrs>
          <Form.Label>Email</Form.Label>
          <Input {...attrs} disabled={savingInProgress} bind:value={$formData.email} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="address">
        <Form.Control let:attrs>
          <Form.Label>Address</Form.Label>
          <Input {...attrs} disabled={savingInProgress} bind:value={$formData.address} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="phone_number">
        <Form.Control let:attrs>
          <Form.Label>Phone number</Form.Label>
          <Input {...attrs} disabled={savingInProgress} bind:value={$formData.phone_number} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="embeded_map_url">
        <Form.Control let:attrs>
          <Form.Label>Embeded map</Form.Label>
          <Input {...attrs} disabled={savingInProgress} bind:value={$formData.embeded_map_url} />
          {#if $formData.embeded_map_url}
            {@html $formData.embeded_map_url}
          {/if}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="grid items-center gap-4">
      <Form.Field {form} name="navigation_url">
        <Form.Control let:attrs>
          <Form.Label>Navigation URL</Form.Label>
          <Input {...attrs} disabled={savingInProgress} bind:value={$formData.navigation_url} />
          {#if $formData.navigation_url}
            <a href={$formData.navigation_url} target="_blank" class="underline flex flex-row gap-2 items-center"><Link size=16/> <span>Try your navigtion link</span></a>
          {/if}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
  </div>
  <Form.Button disabled={savingInProgress} >
    <div class="flex flex-row item-center gap-2">
      {#if savingInProgress}
        <LoaderCircle class="animate-spin" size=16/>
      {/if}
      <span>SAVE CHANGES</span>
    </div>
  </Form.Button>
</form>
