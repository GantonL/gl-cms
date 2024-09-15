<script lang="ts">
	import type { Image } from "$lib/models/image";
	import { Pencil, PencilOff, Plus, Trash, DownloadCloud } from "lucide-svelte";
	import { Button } from "../ui/button";
	import { ScrollArea } from "../ui/scroll-area";
	import { createEventDispatcher } from "svelte";
	import * as AlertDialog from "../ui/alert-dialog";
	import { locale, t } from "$lib/i18n/translations";
	import { currentProject } from "$lib/client/stores";

    type scrollableImage = Image & {month?: number, displayDate?: string, deleteInProgress?: boolean;};   
    export let images: scrollableImage[];
    export let disabled = false;
    export let scrollAreaClass = '';
    const dispatch = createEventDispatcher();
    let editMode = false;
    let deleteImageDialogOpened = false;
    let deleteCandidate: scrollableImage;

    $: if (images.length > 0) {
        images = images.sort((a,b) => { 
            return (a.date ?? 0) - (b.date ?? 0)
        });
        let previousMonth = 0;
        images = images.map((image, index) => {
            const month = Number(new Intl.DateTimeFormat(t.get(`common.date_format_type.${$locale}`), {'month': 'numeric'}).format(image.date));
            let displayDate;
            if (((index > 0) && (month !== previousMonth)) || index === 0) {
                displayDate = new Intl.DateTimeFormat(t.get(`common.date_format_type.${$locale}`), {'month': "short", 'year': 'numeric'}).format(image.date)
            }
            previousMonth = month;
            return {
                ...image,
                month,
                displayDate,
            }
        })
    }

    async function saveAs(uri: string) {
      const data = await (await fetch(uri)).arrayBuffer();
      const buffer = Buffer.from(data).toString('base64')
      const downloadLink = document.createElement("a")
      downloadLink.href = `date:image/png;base64,${buffer}`
      downloadLink.download = `${$currentProject?.name ?? 'gl-project'}-image.png`;
      downloadLink.click();
      document.removeChild(downloadLink)
    }

</script>
<div class="flex flex-col gap-2">
    <div class="flex flex-row gap-2 items-center">
        <Button variant="outline" class="flex flex-row items-center gap-2 w-fit" 
            {disabled}
            on:click={() => {dispatch('create')}}>
            <Plus size=16/>
            <span>{$t('common.add_image')}</span>
        </Button>
        <Button variant="outline" class="flex flex-row items-center gap-2 w-fit" 
            {disabled}
            on:click={() => {editMode = !editMode}}>
            {#if editMode}
                <PencilOff size=16/>
                <span>{$t('common.cancel_edit')}</span>
            {:else}
                <Pencil size=16/>
                <span>{$t('common.edit')}</span>
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
                <figure class="w-48 relative group" class:blur-sm={image.deleteInProgress}>
                    <img src={image.url} class="object-cover border rounded-md shadow-md" loading="lazy" alt="Figure in a scroll area"/>
                    <Button variant="ghost" size="icon" class="bg-destructive/70 absolute bottom-1 right-1 {editMode ? 'flex' : 'hidden'}" 
                        {disabled}
                        on:click={() => {
                            deleteImageDialogOpened = true;
                            deleteCandidate = image
                        }}>
                        <Trash size=16 />
                    </Button>
                    <Button variant="secondary" size="icon" class="absolute top-1 right-1 hidden group-hover:flex" 
                        {disabled}
                        on:click={() => {
                            saveAs(image.url)
                        }}>
                        <DownloadCloud size=16 />
                    </Button>
                </figure>
            {/each}
        </div>
    </ScrollArea>
</div>

<AlertDialog.Root bind:open={deleteImageDialogOpened}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>{$t('common.confirm_dialog_title')}</AlertDialog.Title>
            <AlertDialog.Description>
                {$t('common.delete_image_confirmation_description')}
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel>{$t('common.cancel')}</AlertDialog.Cancel>
            <AlertDialog.Action class="bg-destructive text-destructive-foreground hover:bg-destructive/80"
                on:click={() => {
                    dispatch('delete', deleteCandidate);
                    deleteCandidate.deleteInProgress = true
                    images = images
                }}
            >{$t('common.delete').toUpperCase()}</AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>