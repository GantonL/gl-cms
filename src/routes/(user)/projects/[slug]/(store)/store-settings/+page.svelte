<script lang="ts">
	import { page } from "$app/stores";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { LoaderCircle } from "lucide-svelte";
	import { toast } from "svelte-sonner";

  let disabled = false;
  let activationInProgress = false;
  function toggleStoreActivationStatus() {
    disabled = true;
    activationInProgress = true;
    const body = new FormData();
    const desiredActivationValue = !settings.active; 
    body.append('active', String(desiredActivationValue));
    body.append('id', settings.id);
    fetch(`/projects/${project.id}/store-settings`, { method: 'POST', body })
      .then((res) => {
        res?.json()?.then(_ => {
          if (_.success) {
            toast.success('Store activation status changed');
            settings.active = desiredActivationValue;
          } else {
            toast.error('Failed to change store activation status');
          }
          activationInProgress = false;
          disabled = false;
        })
        .catch(() => {
          activationInProgress = false;
          disabled = false;
          toast.error('Unexpected Error occured');
        });
      })
      .catch(() => {
        activationInProgress = false;
        disabled = false;
        toast.error('Unexpected Error occured');
      });
  }

  $: project = $page.data.project;
  $: settings = $page.data.settings;
</script>
<Card.Root class="border-destructive bg-destructive/20">
  <Card.Header>
    <Card.Title class="text-destructive">Danger Zone</Card.Title>
  </Card.Header>
  <Card.Title></Card.Title>
  <Card.Footer>
    <Button class="w-full flex flex-row gap-2 items-center" {disabled} variant={settings?.active ? 'destructive' : 'secondary'}
      on:click={toggleStoreActivationStatus}>
      {#if activationInProgress}
        <LoaderCircle class="animate-spin"></LoaderCircle>
      {/if}
      {settings?.active ? 'DEACTIVATE STORE' : 'ACTIVATE STORE'}
    </Button>
  </Card.Footer>
</Card.Root>