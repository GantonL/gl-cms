<script lang="ts">
  import { createAvatar } from '@dicebear/core';
	import * as Avatar from '../ui/avatar';
  import * as dicebearCollections from '@dicebear/collection'; 

  export let seed = '';
  export let url = '';
  export let fallback = '?';
  export let style = dicebearCollections.avataaars;
  const dataUri = url.length > 0 ? url : (seed.length > 0 ? createAvatar(style, {seed}).toDataUriSync() : '');

</script>
<Avatar.Root class="border rounded-full">
  <Avatar.Image src={dataUri} alt="GL avatar" />
  <Avatar.Fallback>{(fallback).split(' ')[0].charAt(0).toUpperCase()}</Avatar.Fallback>
</Avatar.Root>