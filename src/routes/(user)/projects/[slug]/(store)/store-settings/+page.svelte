<script lang="ts">
	import { page } from "$app/stores";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { LoaderCircle } from "lucide-svelte";
	import { toast } from "svelte-sonner";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Input } from "$lib/components/ui/input";

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

  function onBannerChanged() {
    disabled = true;
    const body = new FormData();
    body.append('banner', settings.banner);
    body.append('id', settings.id);
    fetch(`/projects/${project.id}/store-settings`, { method: 'POST', body })
      .then((res) => {
        res?.json()?.then(_ => {
          if (_.success) {
            toast.success('Store banner changed');
          } else {
            toast.error('Failed to change store banner');
          }
          disabled = false;
        })
        .catch(() => {
          disabled = false;
          toast.error('Unexpected Error occured');
        });
      })
      .catch(() => {
        disabled = false;
        toast.error('Unexpected Error occured');
      });
  }

  function onDiscountChanged() {
    disabled = true;
    const body = new FormData();
    body.append('global_discount', settings.global_discount);
    body.append('id', settings.id);
    fetch(`/projects/${project.id}/store-settings`, { method: 'POST', body })
      .then((res) => {
        res?.json()?.then(_ => {
          if (_.success) {
            toast.success('Store discount changed');
          } else {
            toast.error('Failed to change store discount');
          }
          disabled = false;
        })
        .catch(() => {
          disabled = false;
          toast.error('Unexpected Error occured');
        });
      })
      .catch(() => {
        disabled = false;
        toast.error('Unexpected Error occured');
      });
  }

  $: project = $page.data.project;
  $: settings = $page.data.settings;
</script>
<div class="flex flex-col gap-4">
  <Card.Root>
    <Card.Header>
      <Card.Title>Banner</Card.Title>
      <Card.Description>The global message that will always appear at the top of your website</Card.Description>
    </Card.Header>
    <Card.Content>
      <Textarea bind:value={settings.banner} {disabled}/>
    </Card.Content>
    <Card.Footer class="flex flex-row justify-end">
      <Button class="flex flex-row gap-2 items-center" {disabled}
        on:click={onBannerChanged}>
        SAVE CHANGES
      </Button>
    </Card.Footer>
  </Card.Root>
  <Card.Root>
    <Card.Header>
      <Card.Title>Global Discout Percentage</Card.Title>
      <Card.Description>A global store discount to be applied on all products</Card.Description>
    </Card.Header>
    <Card.Content>
      <Input type="number" min=0 max=100 bind:value={settings.global_discount} {disabled}/>
      <p class="text-sm text-muted-foreground">Enter a number between 0 to 100</p>
    </Card.Content>
    <Card.Footer class="flex flex-row justify-end">
      <Button class="flex flex-row gap-2 items-center" {disabled}
        on:click={onDiscountChanged}>
        SAVE CHANGES
      </Button>
    </Card.Footer>
  </Card.Root>
  <Card.Root class="border-destructive bg-destructive/20">
    <Card.Header>
      <Card.Title class="text-destructive">Danger Zone</Card.Title>
    </Card.Header>
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
</div>