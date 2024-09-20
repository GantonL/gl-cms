<script lang="ts">
	import { CurrencyType } from "$lib/enums/currency";

  export let type: CurrencyType = CurrencyType.ILS;

</script>
<span class="flex flex-row gap-2 items-center" dir="ltr">
  <slot />
  {#if type === CurrencyType.ILS}
    {@html '&#8362;'}
  {/if}
</span>