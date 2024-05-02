<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import * as Avatar from "$lib/components/ui/avatar";
	import type { User } from "$lib/models/user";
	import { Button } from "../ui/button";
	import { ShieldCheck, Trash, UserCog, UserPlus } from "lucide-svelte";
	import * as Tooltip from "../ui/tooltip"; 
  import { createEventDispatcher } from 'svelte'
	import * as Dialog from "../ui/dialog";
	import CreateUserForm from "../../../routes/(admin)/users/create-user-form.svelte";

  export let user: User | null;
  export let form = undefined;
  export let inProcess = false;
  const dispatch = createEventDispatcher();
</script>
<div class:blur-sm={inProcess}>
  <Card.Root class="w-60 h-full">
    {#if user === null}
      <div class="flex items-center justify-center w-full h-full">
        <Dialog.Root>
          <Dialog.Trigger>
            <Button variant="ghost" class="w-full h-full"><UserPlus size=24/></Button>
          </Dialog.Trigger
          >
          <Dialog.Content class="sm:max-w-[425px]">
            <Dialog.Header>
              <Dialog.Title>Create user</Dialog.Title>
            </Dialog.Header>
            {#if form}
              <CreateUserForm data={form}/>
            {/if}
          </Dialog.Content>
        </Dialog.Root>
      </div>
  
    {:else}
      <Card.Header>
        <Card.Title>
          <div class="flex flex-row items-center gap-2">
            <Avatar.Root>
              <Avatar.Image src={user.image} alt="User Avatar" />
              <Avatar.Fallback>{user.name.split(' ')[0].charAt(0).toUpperCase()}</Avatar.Fallback>
            </Avatar.Root>
            <div class="flex flex-col gap-1">
              <span>{user.name}</span>
              <span class="text-sm text-muted-foreground font-italic">{user.email}</span>
            </div>
          </div>
        </Card.Title>
        <Card.Description></Card.Description>
      </Card.Header>
      <Card.Content>
        <p class="flex flex-row gap-2 text-sm text-muted-foreground font-italic">
          Role: <span class="text-primary/50 flex flex-row gap-2">
            {#if user.role == "admin"}
              <ShieldCheck size=16/>
            {/if}  
            <span>{user.role}</span>
          </span>
        </p>
        <p class="text-sm text-muted-foreground font-italic">Created at: {new Intl.DateTimeFormat('en-US').format(user.created_at)}</p>
      </Card.Content>
      <Card.Footer>
        <section class="w-full flex fex-row flex-row-reverse">
          <section class="flex flex-row gap-2">
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Button variant="destructive" size="icon" class="border border-destructive" on:click={() => dispatch('delete', user.id)}><Trash size=16/></Button>
              </Tooltip.Trigger>
              <Tooltip.Content>Delete</Tooltip.Content>
            </Tooltip.Root>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Button variant="outline" size="icon" on:click={() => dispatch('setRole', user.id)}><UserCog size=16 /></Button>
              </Tooltip.Trigger>
              <Tooltip.Content>Set role</Tooltip.Content>
            </Tooltip.Root>
          </section>
        </section>
      </Card.Footer>
    {/if}
  </Card.Root>
</div>