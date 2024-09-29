<script lang="ts">
	import { t } from "$lib/i18n/translations";
	import { Circle, CircleCheckBig } from "lucide-svelte";
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
<Card.Root>
  <Card.Header>
    <div class="flex flex-row justify-between gap-4">
      <div class="flex flex-col gap-2">
        <Card.Title>{$t(`common.forms_types.${type}.title`)}</Card.Title>
        <Card.Description>{$t(`common.forms_types.${type}.description`)}</Card.Description>
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
  <Card.Content>
    <!-- Preview goes here -->
  </Card.Content>
</Card.Root>