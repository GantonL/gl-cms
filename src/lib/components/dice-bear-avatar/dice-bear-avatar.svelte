<script lang="ts">
  import { createAvatar, type Style } from '@dicebear/core';
	import * as Avatar from '../ui/avatar';

  export let seed: string;
  export let fallback: string;
  export let style: Style<any>;
  const avatar = createAvatar(style, {seed});
  const dataUri = avatar.toDataUriSync();

</script>
<Avatar.Root class="border rounded-full">
  <Avatar.Image src={dataUri} alt="Dice bear avatar" />
  <Avatar.Fallback>{(fallback ?? '?').split(' ')[0].charAt(0).toUpperCase()}</Avatar.Fallback>
</Avatar.Root>