<script lang="ts">
	import type { Image } from "$lib/models/image";
	import { Pencil, PencilOff, Plus, Trash } from "lucide-svelte";
	import { Button } from "../ui/button";
	import { ScrollArea } from "../ui/scroll-area";
	import { createEventDispatcher, onMount } from "svelte";

    export let images: Image[];
    export let disabled = false;
    const dispatch = createEventDispatcher();
    let editMode = false;

    onMount(() => {
        images = images.sort((a,b) => { 
            return (a.date ?? 0) - (b.date ?? 0)
        });
    })

</script>
<div class="flex flex-col gap-2">
    <div class="flex flex-row gap-2 items-center">
        <Button variant="outline" class="flex flex-row items-center gap-2 w-fit" 
            {disabled}
            on:click={() => {dispatch('create')}}>
            <Plus size=16/>
            <span>Add image</span>
        </Button>
        <Button variant="outline" class="flex flex-row items-center gap-2 w-fit" 
            {disabled}
            on:click={() => {editMode = !editMode}}>
            {#if editMode}
                <PencilOff size=16/>
                <span>Cancel edit</span>
            {:else}
                <Pencil size=16/>
                <span>Edit</span>
            {/if}
        </Button>
    </div>
    <ScrollArea>
        <div class="flex flex-row flex-wrap gap-4 items-center">
            {#each images as image }
                <figure class="w-48 relative">
                    <img src={image.url} class="object-cover border rounded-md shadow-md" loading="lazy" alt="Figure in a scroll area"/>
                    <Button variant="ghost" size="icon" class="bg-destructive/70 absolute bottom-1 right-1 {editMode ? 'flex' : 'hidden'}" 
                        {disabled}
                        on:click={() => dispatch('delete', image)}>
                        <Trash size=16 />
                    </Button>
                </figure>
            {/each}
        </div>
    </ScrollArea>
</div>