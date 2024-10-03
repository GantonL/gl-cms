<script lang="ts">
	import { page } from "$app/stores";
	import FormPreview from "$lib/components/forms/form-preview/form-preview.svelte";
	import { FormsTypes } from "$lib/configurations/forms";
	import { FormType } from "$lib/enums/form-type";
	import { t } from "$lib/i18n/translations";
	import type { FormTemplate } from "$lib/models/form-template";
	import type { Project } from "$lib/models/project";

	$: projectForms = $page.data.forms as FormTemplate[] ?? [];
	$: project = $page.data.project as Project;

	function onAddOrRemoveFormType(type: FormType, toggle: boolean, currentIndex: number) {
		if (toggle) {
			createTemplate(type);
		} else {
			removeTemplate(projectForms[currentIndex].id, () => projectForms.splice(currentIndex, 1));
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

</script>
<h1>{$t('common.forms')}</h1>
<div class="flex flex-row flex-wrap gap-4 items-center mt-4">
	{#each FormsTypes[project.type] as type, i}
		<FormPreview {type} check={projectForms.map(t => t.type).includes(type)} on:checked={(event) => onAddOrRemoveFormType(type, event.detail, i)}/>
	{/each}
</div>