<script lang="ts">
	import { page } from "$app/stores";
	import FormPreview from "$lib/components/forms/form-preview/form-preview.svelte";
	import { Button } from "$lib/components/ui/button";
	import Textarea from "$lib/components/ui/textarea/textarea.svelte";
	import { FormsTypes } from "$lib/configurations/forms";
	import { FormType } from "$lib/enums/form-type";
	import { t } from "$lib/i18n/translations";
	import type { FormTemplate } from "$lib/models/form-template";
	import type { Project } from "$lib/models/project";
	import { LoaderCircle } from "lucide-svelte";
	import { onMount } from "svelte";

	$: projectForms = $page.data.forms as FormTemplate[] ?? [];
	$: project = $page.data.project as Project;
	let formFooter = '';
	let settingsSaveInProgress = false;
	
	onMount(() => {
		formFooter = $page.data.project.settings?.clinic?.forms?.footer ?? '';
	})

	function onAddOrRemoveFormType(type: FormType, toggle: boolean, currentIndex: number) {
		if (toggle) {
			createTemplate(type);
		} else {
			const formIdToRemove = projectForms.find(f=>f.type === type)?.id;
			if (!formIdToRemove) { return };
			removeTemplate(formIdToRemove, () => projectForms.splice(currentIndex, 1));
		}
	}

	function createTemplate(type: FormType) {
		const body = new FormData();
		body.set('project_id', project.id);
		body.set('form_type', type);
		fetch('/forms/templates', {method: 'POST', body})
			.then((res) => {
				res?.json()
					.then((res) => {
						if (res?.success) {
							projectForms.push(res);
						}
					})
			})
	}

	function removeTemplate(id: string, successCallback: () => void) {
		fetch(`/forms/templates/${id}?projectId=${project.id}`, {method: 'DELETE'})
			.then((res) => {
				res?.json()
					.then((res) => {
						if (res?.success) {
							successCallback();
						}
					})
			})
	}

	function saveFormSettigns() {
		settingsSaveInProgress = true;
		const body = new FormData();
		body.append('project_id', project.id);
		body.append('footer', formFooter);
		fetch(`/forms/settings`, {method: 'PUT', body})
		.then((res) => {
			res?.json()
			.then(() => settingsSaveInProgress = false)
		}).catch(() => settingsSaveInProgress = false);
	}

</script>
<h1 class="text-xl">{$t('common.forms')}</h1>
<p>{$t('common.forms_page_usage_description')}</p>
<div class="flex flex-row flex-wrap gap-4 items-center mt-4">
	{#each FormsTypes[project.type] as type, i}
		<FormPreview {type} check={projectForms.map(t => t.type).includes(type)} on:checked={(event) => onAddOrRemoveFormType(type, event.detail, i)}/>
	{/each}
</div>

<h2 class="text-lg pt-4">{$t('common.settings')}</h2>
<p>{$t('common.forms_footer_setting_description')}</p>
<div class="pt-4 flex flex-col gap-2">
	<Textarea class="min-h-24" bind:value={formFooter} disabled={settingsSaveInProgress}/>
	<div class="flex flex-row gap-2 items-center">
		<Button class="w-fit flex flex-row items-center gap-2"
			on:click={saveFormSettigns}
			disabled={settingsSaveInProgress}>
			{#if settingsSaveInProgress}
				<LoaderCircle size=16 class="animate-spin"/>
			{/if}
			<span>{$t('common.save_changes')}</span>
		</Button>
		<Button class="w-fit flex flex-row items-center gap-2" variant="secondary"
			on:click={() => formFooter = project.settings?.clinic?.forms?.footer ?? ''}
			disabled={settingsSaveInProgress}>
			<span>{$t('common.cancel')}</span>
		</Button>
	</div>
</div>