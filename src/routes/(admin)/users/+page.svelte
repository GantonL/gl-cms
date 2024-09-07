<script lang="ts">
	import { page } from "$app/stores";
	import UserCard from "$lib/components/user-card/user-card.svelte";
	import { t } from "$lib/i18n/translations";
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
            toast.success(t.get('common.user_delete_success'));
            const deletedUserIndex = users.findIndex((u: User) => u.id === userId);
            users.splice(deletedUserIndex, 1);
            users = users;
          } else {
            toast.error(t.get('common.user_delete_failed'));
          }
          deleting[userId] = false;
        }) 
      })
    }
  }
  $: users = $page.data.users;
  $: projects = $page.data.projects;
</script>
 
<h1 class="text-xl">{$t('common.users')}</h1>
<div class="grid grid-cols-3 gap-4">
  <UserCard user={null} form={$page.data.form} {projects}/>
  {#each users as user}
    <UserCard user={user} inProcess={deleting[user.id]} on:delete={(event) => deleteUser(event)}/>
  {/each}
</div>