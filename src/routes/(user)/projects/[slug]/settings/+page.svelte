<script lang="ts">
  import { page } from "$app/stores";
	import * as Card from "$lib/components/ui/card";
	import { UserPermissions } from "$lib/enums/permission";
  import FBCredentialsForm from './FB-credentials-form.svelte';
	import { KeyRound, Settings } from "lucide-svelte";
  
  $: permissions = $page.data.permissions;
</script>
<Card.Root>
  <Card.Header>
    <Card.Title><span class="flex flex-row gap-2 items-center"><Settings /> Settings</span></Card.Title>
  </Card.Header>
</Card.Root>
{#if permissions.includes(UserPermissions.ViewDBCredentials)}
  <Card.Root>
    <Card.Header>
      <Card.Title><span class="flex flex-row gap-2 items-center"><KeyRound /> Crenedials</span></Card.Title>
      <Card.Content>
        <FBCredentialsForm data={$page.data.credentialsForm} {permissions}></FBCredentialsForm>
      </Card.Content>
    </Card.Header>
  </Card.Root>
{/if}