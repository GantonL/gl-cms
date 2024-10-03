<script lang="ts">
	import { t } from "$lib/i18n/translations";
	import { Minus, Plus } from "lucide-svelte";
	import { Button } from "../../ui/button";
	import * as Card from "../../ui/card";
	import type { FormType } from "$lib/enums/form-type";
	import { createEventDispatcher } from "svelte";
	import FormShadowTemplate from "../form-shadow-template/form-shadow-template.svelte";

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
        <FormShadowTemplate/>
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