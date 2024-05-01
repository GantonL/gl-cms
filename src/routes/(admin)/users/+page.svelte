<script lang="ts">
	import { page } from "$app/stores";
	import UserCard from "$lib/components/user-card/user-card.svelte";

  function deleteUser(event: CustomEvent) {

  }
  function setRole(event: CustomEvent) {

  }
</script>
 
<h1 class="text-xl">Users</h1>
<div class="grid grid-cols-3 gap-4">
  <UserCard user={null} form={$page.data.form} />
  {#each $page.data.users as user}
    <UserCard user={user} on:delete={(event) => deleteUser(event)} on:setRole={(event) => setRole(event)}/>
  {/each}
</div>