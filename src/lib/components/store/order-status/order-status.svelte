<script lang="ts">
	import type { StoreOrderStatus } from "$lib/models/store";
  import { StoreOrderStatusStyleConfiguration } from './configuration';

  export let status: StoreOrderStatus;

</script>
<div class="border px-2 py-1" style:background-color={StoreOrderStatusStyleConfiguration[status].bg}>
  <span class="font-semibold" style:color={StoreOrderStatusStyleConfiguration[status].fg}>{status}</span>
</div>