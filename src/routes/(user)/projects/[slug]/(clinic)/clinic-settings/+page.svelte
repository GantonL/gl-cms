<script lang="ts">
	import { t } from "$lib/i18n/translations";
	import { NotebookText, LoaderCircle } from "lucide-svelte";
  import * as Card from "$lib/components/ui/card";
	import Textarea from "$lib/components/ui/textarea/textarea.svelte";
	import { page } from "$app/stores";
	import Button from "$lib/components/ui/button/button.svelte";

  let updateInProgress = false;
  const settings = $page.data?.settings ?? {};

  function saveTreatmentDocumentationTemplate() {
    updateInProgress = true;
    const body = new FormData();
    body.set('settings', JSON.stringify(settings))
    fetch(`/projects/${$page.data.project.id}/clinic-settings`, {method: 'POST', body})
    .then((res) => {
        console.log(res)
        updateInProgress = false;
      });
  }

</script>
<h1>{$t('common.clinic_settings')}</h1>
<div class="flex flex-row flex-wrap gap-4 mt-4">
  <div class="min-w-60 flex-grow">
		<Card.Root>
      <Card.Header>
        <Card.Title>
          <div class="flex flex-row gap-2 items-center">
            <NotebookText size=18/>
            <span>{$t('common.treatment_documentation_template')}</span>
          </div>
        </Card.Title>
        <Card.Description>{$t('common.treatment_documentation_template_description')}</Card.Description>
      </Card.Header>
      <div class="px-4 pb-4 flex flex-col gap-2">
        <Textarea class="min-h-60" bind:value={settings.treatment_documentation_template}/>
        <Button class="w-fit flex flex-row items-center gap-2"
          on:click={saveTreatmentDocumentationTemplate}
          disabled={updateInProgress}>
          {#if updateInProgress}
            <LoaderCircle size=16 class="animate-spin"/>
          {/if}
          <span>{$t('common.save_changes')}</span>
        </Button>
      </div>
    </Card.Root>
	</div>
</div>