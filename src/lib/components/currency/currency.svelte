<script lang="ts">
	import { CurrencyType } from "$lib/enums/currency";

  export let type: CurrencyType = CurrencyType.ILS;
  export let styleClass = '';

</script>
<span class="flex flex-row items-center {styleClass ?? ''}"  dir="ltr">
  <span><slot /></span>
  {#if type === CurrencyType.ILS}
    {@html '&#8362;'}
  {/if}
</span>