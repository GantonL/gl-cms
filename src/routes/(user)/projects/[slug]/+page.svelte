<script lang="ts">
	import { page } from "$app/stores";
	import * as Card from "$lib/components/ui/card";
	import { UserPermissions } from "$lib/enums/permission";
  import FBCredentialsForm from './FB-credentials-form.svelte'
  $: project = $page.data.project;
  $: permissions = $page.data.permissions;
</script>

<h1 class="text-xl">Project name: {project.name}</h1>
<div class="w-full">
  <Card.Root>
    <Card.Header>
      <Card.Title>Analytics</Card.Title>
    </Card.Header>
  </Card.Root>
  <Card.Root>
    <Card.Header>
      <Card.Title>Settings</Card.Title>
    </Card.Header>
  </Card.Root>
  {#if permissions.includes(UserPermissions.ViewDBCredentials)}
    <Card.Root>
      <Card.Header>
        <Card.Title>Crenedials</Card.Title>
        <Card.Content>
          <FBCredentialsForm data={$page.data.credentialsForm}></FBCredentialsForm>
        </Card.Content>
      </Card.Header>
    </Card.Root>
  {/if}
</div>