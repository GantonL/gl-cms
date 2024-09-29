<script lang="ts">
	import { t } from "$lib/i18n/translations";
	import { Circle, CircleCheckBig, FileSignature } from "lucide-svelte";
	import { Button } from "../ui/button";
	import * as Card from "../ui/card";
	import type { FormType } from "$lib/enums/form-type";
	import { createEventDispatcher } from "svelte";
	import * as Tooltip from "../ui/tooltip";

  const dispath = createEventDispatcher();

  export let check = false;
  export let type: FormType;

  function toggleCheck() {
    check = !check;
    dispath('checked', check);
  }
</script>
<Card.Root class=" max-w-96">
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
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Button variant="outline" size="icon" on:click={toggleCheck} class="hover:text-foreground {!check ? 'text-muted' : 'text-primary'}">
            {#if check}
              <CircleCheckBig size=20/>
            {:else}
              <Circle size=20/>
            {/if}
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          {#if check}
            {$t('common.remove_from_project')}
          {:else}
            {$t('common.add_to_project')}
          {/if}
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  </Card.Header>
</Card.Root>