<script lang="ts">
	import { t } from "$lib/i18n/translations";
	import { Minus, Plus, FileSignature } from "lucide-svelte";
	import { Button } from "../ui/button";
	import * as Card from "../ui/card";
	import type { FormType } from "$lib/enums/form-type";
	import { createEventDispatcher } from "svelte";

  const dispath = createEventDispatcher();

  export let check = false;
  export let type: FormType;

  function toggleCheck() {
    check = !check;
    dispath('checked', check);
  }
</script>
<Card.Root class="max-w-96 {check ? 'border-2 border-primary' : ''}">
  <Card.Header>
    <div class="flex flex-row justify-between items-start gap-4">
      <div class="flex flex-row gap-4">
        <div class="border rounded-md h-24 w-20 flex flex-col items-center gap-2 p-2">
          <div class="bg-secondary h-2 w-3/4 rounded-md"></div>
          <div class="flex flex-col items-start gap-2 w-full">
            <div class="bg-secondary border-b-2 w-full"></div>
            <div class="bg-secondary border-b-2 w-3/4"></div>
            <div class="bg-secondary border-b-2 w-1/3"></div>
            <div class="bg-secondary border-b-2 w-1/2"></div>
          </div>
          <div class="flex items-end justify-end flex-grow w-full">
            <FileSignature size=14 class=" text-secondary"/>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <Card.Title>{$t(`common.forms_types.${type}.title`)}</Card.Title>
          <Card.Description>{$t(`common.forms_types.${type}.description`)}</Card.Description>
        </div>
      </div>
    </div>
  </Card.Header>
  <Card.Footer>
    <div class="flex flex-row gap-2 items-center">
      <Button variant="secondary">{$t('common.preview')}</Button>
      <Button variant={check ? 'destructive' : 'default'} on:click={toggleCheck} class="flex flex-row items-center gap-2">
        {#if check}
          <Minus size=20/>
        {:else}
          <Plus size=20/>
        {/if}
        <span>
          {#if check}
            {$t('common.remove')}
          {:else}
            {$t('common.add')}
          {/if}
        </span>
      </Button>
    </div>
  </Card.Footer>
</Card.Root>