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
	import { LoaderCircle, UploadCloud } from "lucide-svelte";
    
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
        }
      });
      
      enhance = form.enhance;
      formData = form.form;
    }
  
    updateFormData();
        
  </script>
  <form id="add-file" method="POST" action={`?/add-file`} enctype="multipart/form-data" use:enhance>
    <div class="grid gap-4">
      <div class="grid items-center gap-4">
        <Form.Field {form} name="location">
          <Form.Control let:attrs>
            <Form.Label>Location</Form.Label>
            <Input {...attrs} placeholder="files/" bind:value={$formData.location} disabled={submissionInProgress}/>
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </div>
      <div class="grid items-center gap-4">
        <Form.Field {form} name="file">
          <Form.Control let:attrs>
            <Input {...attrs} type="file" bind:value={$formData.file} disabled={submissionInProgress}/>
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </div>
    </div>
    <Form.Button disabled={submissionInProgress}>
        <div class="flex flex-row gap-2 items-center">
            {#if submissionInProgress}
                <LoaderCircle size=14 class="animate-spin"/>
            {:else}
                <UploadCloud size=14 />
            {/if}
        <span>Upload</span>
        </div>
    </Form.Button>
  </form>
  