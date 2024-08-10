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
  import { LoaderCircle } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import { createEventDispatcher } from "svelte";

  export let data: SuperValidated<Infer<FormSchema>>;
  export let action: 'update' | 'create';
  export let disabled = false;

  let enhance: SuperForm<Infer<FormSchema>>['enhance'];
  let form: SuperForm<Infer<FormSchema>>;
  let formData: SuperForm<Infer<FormSchema>>['form'];
  const dispatch = createEventDispatcher();
  let submissionInProgress = false;

  
  function updateFormData() {
    form = superForm(data.data, {
      dataType: 'json',
      validators: zodClient(formSchema),
      onSubmit: (input) => {
        submissionInProgress = true;
        input.formData.set('id', String($formData.id));
      },
      onUpdated: ({form: f}) => {
        if (f?.valid) {
          formData.set(f.data);
          if (action === 'create') {
            toast.success('Patient was successfuly created');
            dispatch('created', f.data);
          } else {
            toast.success('Patient details were successfuly updated');
            dispatch('updated', f.data);
          }
        } else {
          if (f.errors?._errors) {
            toast.error("Something went wrong.");
          } else {
            toast.error("Some fields are invalid.");
          }
        }
        submissionInProgress = false;
      }
    });
    
    enhance = form.enhance;
    formData = form.form;
  }

  updateFormData();

</script>
<form method="POST" action={`?/${action}`} enctype="multipart/form-data" use:enhance>
  <div class="grid gap-4">
    
  </div>
  <Form.Button disabled={submissionInProgress || disabled}>
    <div class="flex flex-row gap-1 items-center">
      {#if submissionInProgress}
        <LoaderCircle class="animate-spin" size=16/>       
      {/if}
      <span>Submit</span>
    </div>
  </Form.Button>
</form>
