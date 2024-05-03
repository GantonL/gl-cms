<script lang="ts">
	import { page } from "$app/stores";
	import UserCard from "$lib/components/user-card/user-card.svelte";
	import type { User } from "$lib/models/user";
	import { toast } from "svelte-sonner";

  let deleting: Record<string, boolean> = {};
  function deleteUser(event: CustomEvent) {
    const userId = event?.detail;
    deleting[userId] = true
    if (userId) {
      fetch(`/users/${userId}`, { method: 'DELETE' }).then((res) => {
        res?.json()?.then(_ => {
          if (_.success) {
            toast.success('User deleted successfuly');
            const deletedUserIndex = users.findIndex((u: User) => u.id === userId);
            users.splice(deletedUserIndex, 1);
            users = users;
          } else {
            toast.error('Failed to delete user');
          }
          deleting[userId] = false;
        }) 
      })
    }
  }
  $: users = $page.data.users;
  $: projects = $page.data.projects;
</script>
 
<h1 class="text-xl">Users</h1>
<div class="grid grid-cols-3 gap-4">
  <UserCard user={null} form={$page.data.form} {projects}/>
  {#each users as user}
    <UserCard user={user} inProcess={deleting[user.id]} on:delete={(event) => deleteUser(event)}/>
  {/each}
</div>