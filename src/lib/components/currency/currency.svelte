<script lang="ts">
	import { CurrencyType } from "$lib/enums/currency";

  export let type: CurrencyType = CurrencyType.ILS;

</script>
<span class="flex flex-row items-center" dir="ltr">
  <span><slot /></span>
  {#if type === CurrencyType.ILS}
    {@html '&#8362;'}
  {/if}
</span>