<script lang="ts">
	import type { Image } from "$lib/models/image";
	import { Pencil, PencilOff, Plus, Trash } from "lucide-svelte";
	import { Button } from "../ui/button";
	import { ScrollArea } from "../ui/scroll-area";
	import { createEventDispatcher } from "svelte";
	import * as AlertDialog from "../ui/alert-dialog";

    export let images: (Image & {month?: number, displayDate?: string})[];
    export let disabled = false;
    export let scrollAreaClass = '';
    const dispatch = createEventDispatcher();
    let editMode = false;
    let deleteImageDialogOpened = false;
    let deleteCandidate: Image;

    $: if (images.length > 0) {
        images = images.sort((a,b) => { 
            return (a.date ?? 0) - (b.date ?? 0)
        });
        let previousMonth = 0;
        images = images.map((image, index) => {
            const month = Number(new Intl.DateTimeFormat("en-UK", {'month': 'numeric'}).format(image.date));
            let displayDate;
            if (((index > 0) && (month !== previousMonth)) || index === 0) {
                displayDate = new Intl.DateTimeFormat("en-UK", {'month': "short", 'year': 'numeric'}).format(image.date)
            }
            previousMonth = month;
            return {
                ...image,
                month,
                displayDate,
            }
        })
    }

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
    <ScrollArea class="flex flex-col overflow-y-auto {scrollAreaClass}">
        <div class="flex flex-row flex-wrap gap-4 items-center">
            {#each images as image }
                {#if image.displayDate}
                    <div class="w-full flex sticky">
                        <span class="m-auto">{image.displayDate}</span>
                    </div>
                {/if}
                <figure class="w-48 relative">
                    <img src={image.url} class="object-cover border rounded-md shadow-md" loading="lazy" alt="Figure in a scroll area"/>
                    <Button variant="ghost" size="icon" class="bg-destructive/70 absolute bottom-1 right-1 {editMode ? 'flex' : 'hidden'}" 
                        {disabled}
                        on:click={() => {
                            deleteImageDialogOpened = true;
                            deleteCandidate = image
                        }}>
                        <Trash size=16 />
                    </Button>
                </figure>
            {/each}
        </div>
    </ScrollArea>
</div>

<AlertDialog.Root bind:open={deleteImageDialogOpened}>
<AlertDialog.Content>
    <AlertDialog.Header>
    <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
    <AlertDialog.Description>
        This action cannot be undone. This will permanently delete the selected image.
    </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
    <AlertDialog.Action class="bg-destructive text-destructive-foreground hover:bg-destructive/80" on:click={() => dispatch('delete', deleteCandidate)}>DELETE</AlertDialog.Action>
    </AlertDialog.Footer>
</AlertDialog.Content>
</AlertDialog.Root>