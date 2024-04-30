<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import * as Avatar from "$lib/components/ui/avatar";
	import type { User } from "$lib/types/user";
	import { Button } from "../ui/button";
	import { ShieldCheck, Trash, UserCog, UserPlus } from "lucide-svelte";
	import * as Tooltip from "../ui/tooltip"; 
  import { createEventDispatcher } from 'svelte'
	import * as Dialog from "../ui/dialog";
	import { Label } from "../ui/label";
	import { Input } from "../ui/input";

  export let user: User | null;
  const dispatch = createEventDispatcher();
</script>
<Card.Root class="w-60 aspect-video">
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
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="name" class="text-right">Name</Label>
              <Input id="name" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="email" class="text-right">Email</Label>
              <Input id="email" type="email" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="role" class="text-right">Role</Label>
              <Input id="role" type="text" class="col-span-3" />
            </div>
          </div>
          <Dialog.Footer>
            <Button type="submit">Create</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  {:else}
    <Card.Header>
      <Card.Title>
        <Avatar.Root>
          <Avatar.Image src={user.image} alt="User Avatar" />
          <Avatar.Fallback>{user.name.split(' ')[0].charAt(0).toUpperCase()}</Avatar.Fallback>
        </Avatar.Root>
        {user.name}
      </Card.Title>
      <Card.Description>{user.email}</Card.Description>
    </Card.Header>
    <Card.Content>
      <p>Role: <span class="text-primary/20 flex flex-row gap-2">
        {#if user.role == "admin"}
          <ShieldCheck size=16/>
        {/if}  
        {user.role}
        </span>
      </p>
    </Card.Content>
    <Card.Footer>
      <section class="w-full flex fex-row justify-between">
        <p class="text-sm text-muted-foreground font-italic">Created at: {user.created_at}</p>
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