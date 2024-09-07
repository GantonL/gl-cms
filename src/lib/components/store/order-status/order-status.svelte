<script lang="ts">
	import { t } from "$lib/i18n/translations";
	import type { StoreOrderStatus } from "$lib/models/store";
  import { StoreOrderStatusStyleConfiguration } from './configuration';

  export let status: StoreOrderStatus;

</script>
<div class="border rounded-lg px-2 py-1 {StoreOrderStatusStyleConfiguration[status].bg}">
  <div class="w-full flex flex-row items-center justify-center gap-2 {StoreOrderStatusStyleConfiguration[status].fg}">
    <svelte:component this={StoreOrderStatusStyleConfiguration[status].icon} size=14></svelte:component>
    <span class="font-semibold">{$t(`common.${status}`)}</span>
  </div>
</div>