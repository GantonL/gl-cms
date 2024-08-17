<script lang="ts">
	import type { ClinicPatient } from "$lib/models/clinic";
	import { AlertTriangle, NotebookPen, Pill } from "lucide-svelte";

    export let indications: Partial<ClinicPatient>;
</script>
<div class="flex flex-col gap-2">
    {#if indications.medical_condition}
        <div class="flex flex-row gap-2 items-center">
            <AlertTriangle size=14 class="text-destructive"/>
            <span>Has medical condition</span>
        </div>
    {/if}
    {#if indications.medications}
        <div class="flex flex-row gap-2 items-center">
            <Pill size=14/>
            <span>Takes medications</span>
        </div>
    {/if}
    {#if indications.notes}
        <div class="flex flex-row gap-2 items-center">
            <NotebookPen size=14/>
            <span>Has notes</span>
        </div>
    {/if}
</div>